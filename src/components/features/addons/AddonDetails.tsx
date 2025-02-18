import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryBadges from "@/components/features/addons/addon-card/CategoryBadges";
import ModLoaders from "@/components/features/addons/addon-card/ModLoaders";
import { AddonStats } from "@/components/features/addons/addon-card/AddonStats";
import { ExternalLinks } from "@/components/features/addons/addon-card/ExternalLinks";
import { Star, StarOff, ChevronLeft, ChevronRight, Download, Heart, Github, Globe, Bug } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCollectionStore } from "@/stores/collectionStore";
import {useFetchAddon} from "@/api";


export default function AddonDetails() {
  const { slug } = useParams();
  const [description, setDescription] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { collection, addAddon, removeAddon } = useCollectionStore();
  const isInCollection = collection.includes(slug || "");

  const handleCollectionAction = () => {
    if (!slug) return;
    isInCollection ? removeAddon(slug) : addAddon(slug);
  };
  const { data: addon, isLoading, error } = useFetchAddon(slug);


  useEffect(() => {
    if (!slug) {
      return;
    }

    const loadAddonDetails = async () => {
      try {
        // Process markdown description
        if (addon) {
          const markedHtml = await marked(addon?.modrinth_raw?.description || "");
          const sanitizedHtml = DOMPurify.sanitize(markedHtml, {
            ALLOWED_TAGS: [
              "h1", "h2", "h3", "h4", "h5", "h6",
              "p", "a", "ul", "ol", "li",
              "code", "pre", "strong", "em", "img"
            ],
            ALLOWED_ATTR: ["href", "src", "alt", "title"],
          });
          setDescription(sanitizedHtml);
        }
      } catch (err) {
        console.error("Error loading addon details:", err);
      }
    };

    loadAddonDetails();
  }, [slug]);

  const navigateGallery = (direction: "prev" | "next") => {
    const gallery = addon?.modrinth_raw?.gallery;
    if (!gallery || !Array.isArray(gallery)) return;

    setCurrentImageIndex((prev) => {
      if (direction === "prev") {
        return prev > 0 ? prev - 1 : prev;
      }
      return prev < gallery.length - 1 ? prev + 1 : prev;
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="p-6">
            <p className="text-destructive">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !addon) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-16 w-16 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }
  const modrinthData = typeof addon.modrinth_raw === 'string' ? JSON.parse(addon.modrinth_raw) : addon.modrinth_raw;
  const curseforgeData = typeof addon.curseforge_raw === 'string' ? JSON.parse(addon.curseforge_raw) : addon.curseforge_raw;

  const gallery = modrinthData?.gallery;

  const totalDownloads = (modrinthData?.downloads || 0) + (curseforgeData?.downloadCount || 0);
  const externalLinks = [
    ...(curseforgeData?.links?.sourceUrl ? [{
      icon: <Github className="h-4 w-4" />,
      label: "Source Code",
      url: curseforgeData.links.sourceUrl
    }] : []),
    ...(curseforgeData?.links?.issuesUrl ? [{
      icon: <Bug className="h-4 w-4" />,
      label: "Issue Tracker",
      url: curseforgeData.links.issuesUrl
    }] : []),
    ...(curseforgeData?.links?.websiteUrl ? [{
      icon: <Globe className="h-4 w-4" />,
      label: "Website",
      url: curseforgeData.links.websiteUrl
    }] : [])
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Card */}
      <Card>
        <CardHeader className="space-y-6">
          <div className="flex items-start gap-4">
            <img
              src={addon.icon}
              alt={`${addon.name} icon`}
              className="w-16 h-16 rounded-lg border"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold truncate mb-2">
                  {addon.name}
                </h1>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleCollectionAction}
                >
                  {isInCollection ? <Star /> : <StarOff />}
                </Button>
              </div>
              <p className="text-foreground-muted">{addon.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="text-foreground-muted">
                {totalDownloads.toLocaleString()} total downloads
              </span>
            </div>
            {modrinthData?.follows && (
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="text-foreground-muted">
                  {modrinthData.follows.toLocaleString()} followers
                </span>
              </div>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">Versions</h3>
                <div className="flex flex-wrap gap-2">
                  {addon.versions?.map((version) => (
                    <Badge key={version} variant="outline">
                      {version}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Mod Loaders</h3>
                <ModLoaders addon={addon} />
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Categories</h3>
                <CategoryBadges categories={addon.categories} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">Links</h3>
                <div className="grid grid-cols-1 gap-2">
                  {externalLinks.map((link, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.icon}
                        <span className="ml-2">{link.label}</span>
                      </a>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Available On</h3>
                <ExternalLinks
                  slug={addon.slug}
                  curseforge_raw={addon.curseforge_raw || {}}
                  modrinth_raw={addon.modrinth_raw || {}}
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Gallery Card */}
      {gallery && gallery.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="relative">
              <div className="aspect-video overflow-hidden">
                <img
                  src={gallery[currentImageIndex]}
                  alt={`${addon.name} screenshot ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateGallery("prev")}
                  disabled={currentImageIndex === 0}
                  className="rounded-full bg-background/80 backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateGallery("next")}
                  disabled={currentImageIndex === gallery.length - 1}
                  className="rounded-full bg-background/80 backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1">
                {gallery.map((_: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentImageIndex ? "bg-primary" : "bg-primary/30"
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                    aria-current={idx === currentImageIndex}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Description Card */}
      <Card>
        <CardContent className="p-6 prose prose-neutral dark:prose-invert max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: description }}
            className="markdown-content"
          />
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Author Information</h3>
              <AddonStats
                author={addon.author}
                downloads={totalDownloads}
              />
              {curseforgeData?.authors && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Contributors</h4>
                  <div className="flex flex-wrap gap-2">
                    {curseforgeData.authors.map((author: { id: string , url: string , name: string}) => (
                      <a
                        key={author.id}
                        href={author.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {author.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Project Details</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Created:</span>{" "}
                  {new Date(addon.created_at || Date.now()).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Last Updated:</span>{" "}
                  {new Date(addon.updated_at || Date.now()).toLocaleDateString()}
                </p>
                {modrinthData?.license && (
                  <p>
                    <span className="font-semibold">License:</span>{" "}
                    {modrinthData.license}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}