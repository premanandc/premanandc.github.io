export interface GitHubEvent {
  type: string;
  repo: string;
  message: string;
  date: Date;
}

interface GitHubApiEvent {
  type: string;
  repo: { name: string };
  payload: {
    commits?: { message: string }[];
    action?: string;
    ref?: string;
    ref_type?: string;
  };
  created_at: string;
}

function describeEvent(event: GitHubApiEvent): string | null {
  switch (event.type) {
    case 'PushEvent': {
      const msg = event.payload.commits?.[0]?.message?.split('\n')[0];
      return msg ? `Pushed: "${msg}"` : 'Pushed commits';
    }
    case 'CreateEvent':
      return `Created ${event.payload.ref_type}${event.payload.ref ? ` ${event.payload.ref}` : ''}`;
    case 'PullRequestEvent':
      return `${event.payload.action === 'opened' ? 'Opened' : 'Updated'} a pull request`;
    case 'IssuesEvent':
      return `${event.payload.action === 'opened' ? 'Opened' : 'Closed'} an issue`;
    case 'WatchEvent':
      return 'Starred a repo';
    default:
      return null;
  }
}

export async function getRecentActivity(username: string, limit = 5): Promise<GitHubEvent[]> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/events/public`, {
      headers: { 'User-Agent': 'premonition.dev' },
    });

    if (!res.ok) return [];

    const events: GitHubApiEvent[] = await res.json();

    return events
      .map((event) => {
        const message = describeEvent(event);
        if (!message) return null;
        return {
          type: event.type,
          repo: event.repo.name,
          message,
          date: new Date(event.created_at),
        };
      })
      .filter((e): e is GitHubEvent => e !== null)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function getLastCommitDate(username: string): Promise<Date | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/events/public`, {
      headers: { 'User-Agent': 'premonition.dev' },
    });

    if (!res.ok) return null;

    const events: GitHubApiEvent[] = await res.json();
    const push = events.find((e) => e.type === 'PushEvent');
    return push ? new Date(push.created_at) : null;
  } catch {
    return null;
  }
}
