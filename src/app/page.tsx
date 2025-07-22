import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Github, Download, Package, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ThemeSwitcher } from '@/components/theme-switcher';

interface Asset {
  name: string;
  browser_download_url: string;
  size: number;
}
interface Release {
  id: number;
  html_url: string;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  assets: Asset[];
}

async function getReleases(): Promise<Release[]> {
  try {
    const res = await fetch('https://api.github.com/repos/Aarnav-Tech/winutil/releases', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`GitHub API responded with ${res.status}`);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch releases:", error);
    return [];
  }
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}


export default async function Home() {
  const releases = await getReleases();
  const latestRelease = releases[0];
  const primaryAsset = latestRelease?.assets.find(asset => asset.name.endsWith('.exe'));

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="WinUtil Home">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">WinUtil</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Button asChild variant="ghost" size="icon">
              <a href="https://github.com/Aarnav-Tech/winutil" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
                <Github className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32 lg:py-40">
          <div className="container text-center px-4">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              The Ultimate Windows Utility
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              A powerful, open-source tool to optimize and manage your Windows system. Streamline your workflow with a comprehensive suite of utilities, all in one place.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
              {primaryAsset && (
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-transform hover:scale-105">
                  <a href={primaryAsset.browser_download_url}>
                    <Download className="mr-2 h-5 w-5" />
                    Download Latest ({latestRelease.tag_name})
                  </a>
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="shadow-sm transition-transform hover:scale-105">
                <a href="https://github.com/Aarnav-Tech/winutil" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section id="downloads" className="py-12 md:py-20 bg-card/50">
          <div className="container px-4">
            <h2 className="text-3xl font-bold tracking-tight text-center md:text-4xl font-headline">
              All Versions
            </h2>
            <p className="mt-4 text-center text-muted-foreground max-w-xl mx-auto">
              Browse and download previous versions of WinUtil. Each card links to the full release notes on GitHub.
            </p>
            {releases.length > 0 ? (
              <div className="mt-10 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {releases.map((release) => (
                  <Card key={release.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between">
                        <span>{release.name}</span>
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 shrink-0">
                            <a href={release.html_url} target="_blank" rel="noopener noreferrer" aria-label="View on GitHub">
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </a>
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        Version {release.tag_name} &bull; Released on {format(new Date(release.published_at), 'MMM d, yyyy')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <h3 className="text-sm font-semibold mb-2 text-foreground">Assets</h3>
                      <div className="space-y-2">
                        {release.assets.length > 0 ? release.assets.map(asset => (
                          <a 
                            key={asset.name} 
                            href={asset.browser_download_url}
                            className="group flex items-center justify-between p-3 rounded-md bg-muted/50 hover:bg-accent/20 transition-colors text-sm"
                            aria-label={`Download ${asset.name}`}
                          >
                            <span className="font-medium text-foreground truncate pr-2">{asset.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-xs">{formatBytes(asset.size)}</span>
                              <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"/>
                            </div>
                          </a>
                        )) : <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">No assets provided.</p>}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full">
                        <a href={release.html_url} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          Full Release Notes
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="mt-10 text-center text-muted-foreground bg-card border rounded-lg p-8 max-w-md mx-auto">
                <p>Could not fetch release information at this time.</p> 
                <p className="mt-2">Please visit the <a href="https://github.com/Aarnav-Tech/winutil/releases" className="underline text-primary font-medium hover:text-primary/80">GitHub releases page</a> directly.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="py-6 border-t bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} WinUtil. All rights reserved.
          </p>
          <p className="mt-1">
            <a href="https://github.com/Aarnav-Tech/winutil" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
              Source Code on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
