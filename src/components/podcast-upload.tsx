"use client";
import { FormEvent, useState } from "react";
import { addPodcastByUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const PodcastUpload = () => {
  const [feedUrl, setFeedUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addPodcastByUrl(feedUrl).then(() => {
      toast({
        title: "Success",
        description: "Podcast imported successfully",
      });
    });
  };

  return (
    <div>
      <h1>Import Podcast RSS Feed</h1>
      <form onSubmit={handleSubmit} className={"mt-4"}>
        <div className={"space-x-2 flex flex-row w-1/2"}>
          <Input
            type="url"
            value={feedUrl}
            onChange={(e) => setFeedUrl(e.target.value)}
            placeholder="Enter podcast RSS feed URL"
          />
          <Button type="submit">Import</Button>
        </div>
      </form>
    </div>
  );
};
