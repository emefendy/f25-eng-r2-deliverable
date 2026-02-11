"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { type Database } from "@/lib/schema";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type Comment = Database["public"]["Tables"]["comments"]["Row"] & {
  profiles: {
    display_name: string | null;
  } | null;
};

export default function CommentsSection({
  speciesId,
  currentUserId,
  initialComments,
}: {
  speciesId: number;
  currentUserId: string;
  initialComments: Comment[];
}) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const supabase = createBrowserSupabaseClient();

  // Update comments when initialComments changes
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const fetchComments = async () => {
    console.log("Fetching comments for species:", speciesId);

    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        *,
        profiles!inner (
          display_name
        )
      `,
      )
      .eq("species_id", speciesId)
      .order("created_at", { ascending: false });

    console.log("Fetched comments:", data);
    console.log("Fetch error:", error);

    if (data) {
      setComments(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      return toast({
        title: "Comment cannot be empty",
        variant: "destructive",
      });
    }

    setIsSubmitting(true);

    console.log("Inserting comment:", {
      species_id: speciesId,
      author: currentUserId,
      content: newComment.trim(),
    });

    const { error } = await supabase.from("comments").insert({
      species_id: speciesId,
      author: currentUserId,
      content: newComment.trim(),
    });

    console.log("Insert error:", error);

    if (error) {
      toast({
        title: "Failed to post comment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNewComment("");
      toast({
        title: "Comment posted! 💬",
      });
      // Refresh comments list
      await fetchComments();
    }

    setIsSubmitting(false);
  };

  const handleDelete = async (commentId: number) => {
    const { error } = await supabase.from("comments").delete().eq("id", commentId);

    if (error) {
      toast({
        title: "Failed to delete comment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Comment deleted",
      });
      // Refresh comments list
      await fetchComments();
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-2xl font-bold">Comments 💬</h3>

      {/* New Comment Form */}
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave a comment... 🌸"
          className="rounded-2xl border-2"
          rows={3}
        />
        <Button type="submit" disabled={isSubmitting} className="rounded-full">
          {isSubmitting ? "Posting..." : "Post Comment ✨"}
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        <p className="text-xs text-muted-foreground">Total comments: {comments.length}</p>
        {comments.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No comments yet. Be the first! 🎉</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl border-2 bg-white/60 p-4 transition-shadow hover:shadow-md">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <p className="font-semibold">{comment.profiles?.display_name ?? "Anonymous"}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.created_at ?? Date.now()).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {comment.author === currentUserId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void handleDelete(comment.id)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p>{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
