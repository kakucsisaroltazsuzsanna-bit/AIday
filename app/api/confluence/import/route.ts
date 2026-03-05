import { NextRequest, NextResponse } from 'next/server';

interface ConfluencePageContent {
  id: string;
  type: string;
  status: string;
  title: string;
  body: {
    storage: {
      value: string;
      representation: string;
    };
  };
  metadata?: {
    labels?: {
      results: Array<{ name: string }>;
    };
  };
}

interface ConfluenceTask {
  title: string;
  description: string;
  estimatedHours: number;
  priority: 'High' | 'Medium' | 'Low';
}

// Parse Confluence storage format HTML to extract tasks
function parseConfluenceTasks(html: string): ConfluenceTask[] {
  const tasks: ConfluenceTask[] = [];

  // Look for task lists (ac:task-list) or tables with task information
  const taskListRegex = /<ac:task-list>(.*?)<\/ac:task-list>/gs;
  const taskMatches = html.match(taskListRegex);

  if (taskMatches) {
    taskMatches.forEach(taskList => {
      const taskRegex = /<ac:task>(.*?)<\/ac:task>/gs;
      const individualTasks = taskList.match(taskRegex);

      if (individualTasks) {
        individualTasks.forEach(task => {
          const titleMatch = task.match(/<ac:plain-text-body><!\[CDATA\[(.*?)\]\]><\/ac:plain-text-body>/);
          if (titleMatch) {
            tasks.push({
              title: titleMatch[1].trim(),
              description: `Task from Confluence: ${titleMatch[1].trim()}`,
              estimatedHours: 8,
              priority: 'Medium',
            });
          }
        });
      }
    });
  }

  // Parse tables that might contain task information
  const tableRegex = /<table[^>]*>(.*?)<\/table>/gs;
  const tables = html.match(tableRegex);

  if (tables) {
    tables.forEach(table => {
      const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gs;
      const rows = table.match(rowRegex);

      if (rows && rows.length > 1) {
        // Skip header row
        for (let i = 1; i < rows.length; i++) {
          const cellRegex = /<t[dh][^>]*>(.*?)<\/t[dh]>/gs;
          const cells = Array.from(rows[i].matchAll(cellRegex));

          if (cells.length >= 2) {
            const taskName = cells[0][1].replace(/<[^>]*>/g, '').trim();
            const description = cells[1] ? cells[1][1].replace(/<[^>]*>/g, '').trim() : taskName;

            if (taskName && taskName.length > 0) {
              // Try to extract hours from description or other cells
              let hours = 8;
              const hourMatch = cells.join(' ').match(/(\d+)\s*(?:hours?|hrs?|h)/i);
              if (hourMatch) {
                hours = parseInt(hourMatch[1]);
              }

              // Try to extract priority
              let priority: 'High' | 'Medium' | 'Low' = 'Medium';
              const priorityMatch = cells.join(' ').match(/priority[:\s]*(high|medium|low)/i);
              if (priorityMatch) {
                priority = priorityMatch[1].charAt(0).toUpperCase() + priorityMatch[1].slice(1).toLowerCase() as any;
              }

              tasks.push({
                title: taskName,
                description: description || taskName,
                estimatedHours: hours,
                priority,
              });
            }
          }
        }
      }
    });
  }

  return tasks;
}

// Extract text content from HTML
function extractTextContent(html: string): string {
  // Remove CDATA sections properly
  let text = html.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1');

  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, ' ');

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

// Parse Confluence page URL to extract space and page ID
function parseConfluenceUrl(url: string): { spaceKey?: string; pageId?: string; domain?: string } | null {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    // Pattern 1: /wiki/spaces/SPACE/pages/123456/Page+Title
    const spacesPattern = /\/wiki\/spaces\/([^\/]+)\/pages\/(\d+)/;
    const spacesMatch = url.match(spacesPattern);

    if (spacesMatch) {
      return {
        spaceKey: spacesMatch[1],
        pageId: spacesMatch[2],
        domain,
      };
    }

    // Pattern 2: /wiki/display/SPACE/Page+Title
    const displayPattern = /\/wiki\/display\/([^\/]+)\/([^\/\?#]+)/;
    const displayMatch = url.match(displayPattern);

    if (displayMatch) {
      return {
        spaceKey: displayMatch[1],
        domain,
      };
    }

    // Pattern 3: Just page ID /wiki/pages/123456
    const pageIdPattern = /\/wiki\/pages\/(\d+)/;
    const pageIdMatch = url.match(pageIdPattern);

    if (pageIdMatch) {
      return {
        pageId: pageIdMatch[1],
        domain,
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { confluenceUrl } = await request.json();

    if (!confluenceUrl) {
      return NextResponse.json(
        { error: 'Confluence URL is required' },
        { status: 400 }
      );
    }

    // Check for environment variables
    const domain = process.env.CONFLUENCE_DOMAIN;
    const email = process.env.CONFLUENCE_EMAIL;
    const apiToken = process.env.CONFLUENCE_API_TOKEN;

    if (!domain || !email || !apiToken) {
      return NextResponse.json(
        {
          error: 'Confluence API credentials not configured',
          message: 'Please set CONFLUENCE_DOMAIN, CONFLUENCE_EMAIL, and CONFLUENCE_API_TOKEN in your .env.local file',
          helpUrl: 'https://id.atlassian.com/manage-profile/security/api-tokens',
        },
        { status: 500 }
      );
    }

    // Parse the URL
    const parsed = parseConfluenceUrl(confluenceUrl);

    if (!parsed || !parsed.pageId) {
      return NextResponse.json(
        {
          error: 'Invalid Confluence URL',
          message: 'Could not extract page ID from URL. Please use format: https://yourcompany.atlassian.net/wiki/spaces/SPACE/pages/123456/Page+Title',
        },
        { status: 400 }
      );
    }

    // Fetch page content from Confluence API
    const apiUrl = `https://${domain}/wiki/rest/api/content/${parsed.pageId}?expand=body.storage,metadata.labels`;

    const authHeader = `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Confluence API error:', response.status, errorText);

      if (response.status === 401) {
        return NextResponse.json(
          {
            error: 'Authentication failed',
            message: 'Invalid Confluence credentials. Please check your API token.',
          },
          { status: 401 }
        );
      }

      if (response.status === 404) {
        return NextResponse.json(
          {
            error: 'Page not found',
            message: 'The specified Confluence page does not exist or you do not have access to it.',
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error: 'Failed to fetch Confluence page',
          message: `Confluence API returned status ${response.status}`,
        },
        { status: response.status }
      );
    }

    const pageData: ConfluencePageContent = await response.json();

    // Extract data from page
    const title = pageData.title;
    const htmlContent = pageData.body.storage.value;
    const textContent = extractTextContent(htmlContent);

    // Parse tasks from content
    const tasks = parseConfluenceTasks(htmlContent);

    // Extract labels as stakeholders
    const labels = pageData.metadata?.labels?.results?.map(l => l.name) || [];

    // Determine priority based on labels
    let priority: 'High' | 'Medium' | 'Low' = 'Medium';
    if (labels.some(l => l.toLowerCase().includes('high') || l.toLowerCase().includes('urgent'))) {
      priority = 'High';
    } else if (labels.some(l => l.toLowerCase().includes('low'))) {
      priority = 'Low';
    }

    // Build design brief
    let designBrief = `Imported from Confluence\nPage: ${title}\nURL: ${confluenceUrl}\n\n`;

    // Take first 1000 characters of content as brief
    if (textContent.length > 0) {
      designBrief += textContent.substring(0, 1000);
      if (textContent.length > 1000) {
        designBrief += '...';
      }
    }

    // Return structured data
    return NextResponse.json({
      success: true,
      data: {
        title: `Imported: ${title}`,
        description: `Project imported from Confluence page`,
        designBrief,
        priority,
        stakeholders: labels.length > 0 ? labels : undefined,
        productArea: parsed.spaceKey || undefined,
        tasks: tasks.length > 0 ? tasks : undefined,
        metadata: {
          source: 'confluence',
          pageId: parsed.pageId,
          spaceKey: parsed.spaceKey,
          originalUrl: confluenceUrl,
          importedAt: new Date().toISOString(),
        },
      },
    });

  } catch (error: any) {
    console.error('Confluence import error:', error);

    return NextResponse.json(
      {
        error: 'Import failed',
        message: error.message || 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
