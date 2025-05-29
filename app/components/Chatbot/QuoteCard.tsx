/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
//QuoteCard.tsx
import React, { useRef, useState } from "react";
import Image from "next/image";
import { PERSONALITIES } from "@/app/constants/personalities";
import { FaFacebook, FaLinkedin, FaLink } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiThreads, SiInstagram } from "react-icons/si";
import html2canvas from "html2canvas";
import { uploadQuoteCard } from "@/app/utils/uploadQuoteCard";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface QuoteCardProps {
  text: string;
  html?: string; // rich HTML version of the quote
  author: string;
  onClose: () => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({
  text,
  html,
  author,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const personalityData = PERSONALITIES.find((p) => p.model === author);

  const getPublicUrl = async (): Promise<string | null> => {
    return imageUrl || (await generateCardImage());
  };

  const generateCardImage = async (): Promise<string | null> => {
    if (typeof window === "undefined" || !cardRef.current) return null;
    setIsGeneratingImage(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      const dataUrl = canvas.toDataURL("image/png");

      const publicUrl = await uploadQuoteCard(
        dataUrl,
        `${author.replace(/\s+/g, "-")}-${Date.now()}.png`
      );
      setImageUrl(publicUrl);
      return publicUrl;
    } catch (err: any) {
      console.error("Error generating/uploading image:", err.message || err);
      return null;
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownload = async () => {
    const url = await getPublicUrl();
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${author.replace(/\s+/g, "-")}-quote.png`;
    link.click();
  };

  const handleCopyToClipboard = async () => {
    const textToCopy = `"${text}" — ${author}`;
    
    try {
      // First, try to focus the document
      if (document.hasFocus && !document.hasFocus()) {
        window.focus();
      }
      
      // Try the modern clipboard API
      await navigator.clipboard.writeText(textToCopy);
      alert("Quote text copied to clipboard!");
    } catch (err) {
      console.warn("Modern clipboard API failed, trying fallback:", err);
      
      // Fallback method using the older approach
      try {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          alert("Quote text copied to clipboard!");
        } else {
          throw new Error("Fallback copy failed");
        }
      } catch (fallbackErr) {
        console.error("Both clipboard methods failed:", fallbackErr);
        alert(`Could not copy automatically. Please copy this text manually:\n\n${textToCopy}`);
      }
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.share) {
          const file = new File([blob], `${author}-quote.png`, {
            type: "image/png",
          });
          try {
            await navigator.share({
              title: `Quote from ${author}`,
              text,
              files: [file],
            });
            return;
          } catch (shareErr) {
            console.warn("Native share failed, falling back:", shareErr);
          }
        }
        handleCopyToClipboard();
      }, "image/png");
    } catch (err: any) {
      console.error("Error sharing image:", err.message || err);
    }
  };
  const shareToInstagramStory = async () => {
    // 1️⃣ Ensure we have the public image URL
    const imageUrl = await getPublicUrl();
    if (!imageUrl) {
      alert("Image not ready yet");
      return;
    }

    // 2️⃣ Encode it for use in a URL
    const encodedUrl = encodeURIComponent(imageUrl);
    const sourceApp = encodeURIComponent(window.location.origin);

    // 3️⃣ Deep-link into Instagram Stories on iOS
    window.location.href =
      `instagram-stories://share?` +
      `background_image_url=${encodedUrl}` +
      `&source_application=${sourceApp}`;
  };

  /* 2025-updated share handlers (with Web Share API fallback) */
  const shareToTwitter = async () => {
    const imageUrl = await getPublicUrl();
    if (!imageUrl) return;

    // Quote + author, then your site as the clickable link
    const tweetText = `"${text}" – ${author}\n\nhttps://ask-sephira.com`;

    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(imageUrl)}`;

    window.open(intent, "_blank", "noopener");
  };

  // ——— shareToFacebook ———
  // Facebook only takes a URL, so we point it at your domain
  const shareToFacebook = () => {
    const shareUrl = "https://ask-sephira.com";
    const facebookIntent = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(facebookIntent, "_blank", "noopener");
  };

  // ——— shareToLinkedIn ———
  // LinkedIn's share-offsite endpoint takes a URL + title
  const shareToLinkedIn = async () => {
    const shareUrl = "https://ask-sephira.com";
    const title = `"${text}" – ${author}`;
    const linkedInIntent =
      `https://www.linkedin.com/sharing/share-offsite/` +
      `?url=${encodeURIComponent(shareUrl)}` +
      `&title=${encodeURIComponent(title)}`;

    window.open(linkedInIntent, "_blank", "noopener");
  };

  const shareToThreads = async () => {
    const imageUrl = await getPublicUrl();
    if (!imageUrl) return;

    // Quote → author → your site → image URL
    const prefill =
      `"${text}" – ${author}` +
      `\n\nhttps://ask-sephira.com` +
      `\n\n${imageUrl}`;

    const threadsIntent = `https://www.threads.net/intent/post?text=${encodeURIComponent(
      prefill
    )}`;

    window.open(threadsIntent, "_blank", "noopener");
  };

  const copyShareLink = () => {
    const shareableUrl = `${
      window.location.origin
    }/share?quote=${encodeURIComponent(text)}&author=${encodeURIComponent(
      author
    )}`;
    navigator.clipboard
      .writeText(shareableUrl)
      .then(() => alert("Share link copied!"))
      .catch((err) => console.error("Failed to copy link:", err));
  };

  return (
    <div className="fixed inset-0 bg-background/70 flex items-center justify-center z-50 p-4">
      <div className="bg-background/90 backdrop-blur-md rounded-2xl shadow-2xl border border-border p-6 max-w-md w-full">
        <h3 className="text-foreground text-xl font-medium mb-4">
          Foster the Flame
        </h3>
        <div
          ref={cardRef}
          className="bg-gradient-to-br from-card to-background p-6 rounded-lg border border-border mb-4"
        >
          <div className="flex items-center mb-4">
            {personalityData?.image ? (
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-background/50 flex items-center justify-center">
                <Image
                  src={personalityData.image}
                  alt={author}
                  width={40}
                  height={40}
                  className="object-cover"
                  crossOrigin="anonymous"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                <span className="text-xl text-foreground">
                  {author === "RabbiGPT"
                    ? "✡️"
                    : author === "BuddhaGPT"
                      ? "☸️"
                      : author === "PastorGPT"
                        ? "✝️"
                        : author === "ImamGPT"
                          ? "☪️"
                          : author === "ComparisonGPT"
                            ? "🔄"
                            : "🔹"}
                </span>
              </div>
            )}
            <span className="text-foreground font-medium">{author}</span>
          </div>
          {html ? (
            <div className="markdown-content prose dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/90 max-w-none mb-3">
              <ReactMarkdown 
                rehypePlugins={[rehypeRaw]}
                components={{
                  strong: (props) => <strong className="font-bold text-foreground" {...props} />,
                  p: (props) => <p className="my-2 text-foreground/90" {...props} />,
                  li: (props) => <li className="ml-4 my-1 text-foreground/90" {...props} />,
                  ul: (props) => <ul className="list-disc pl-4 my-2" {...props} />,
                  ol: (props) => <ol className="list-decimal pl-4 my-2" {...props} />
                }}
              >
                {html}
              </ReactMarkdown>
            </div>
          ) : (
            <blockquote className="text-foreground/90 text-lg italic mb-3 leading-relaxed">
              &quot;{text}&quot;
            </blockquote>
          )}
          <div className="flex justify-end">
            <div className="text-xs text-muted-foreground">ask-sephira.com</div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-foreground text-sm mb-2">Share to:</h4>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={shareToInstagramStory}
              disabled={isGeneratingImage}
              title="Share to Instagram Story"
              className="p-2 rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 text-white hover:opacity-80"
            >
              <SiInstagram size={20} />
            </button>
            <button
              onClick={shareToTwitter}
              disabled={isGeneratingImage}
              className="p-2 rounded-full bg-[#1DA1F2]/20 text-[#1DA1F2] hover:bg-[#1DA1F2]/30"
              title="Share to X"
            >
              <FaXTwitter size={20} />
            </button>
            <button
              onClick={shareToFacebook}
              disabled={isGeneratingImage}
              className="p-2 rounded-full bg-[#4267B2]/20 text-[#4267B2] hover:bg-[#4267B2]/30"
              title="Share to Facebook"
            >
              <FaFacebook size={20} />
            </button>
            <button
              onClick={shareToLinkedIn}
              disabled={isGeneratingImage}
              className="p-2 rounded-full bg-[#0077B5]/20 text-[#0077B5] hover:bg-[#0077B5]/30"
              title="Share to LinkedIn"
            >
              <FaLinkedin size={20} />
            </button>
            <button
              onClick={shareToThreads}
              disabled={isGeneratingImage}
              className="p-2 rounded-full bg-muted text-foreground hover:bg-muted/80"
              title="Share to Threads"
            >
              <SiThreads size={20} />
            </button>

            <button
              onClick={copyShareLink}
              className="p-2 rounded-full bg-muted text-foreground hover:bg-muted/80"
              title="Copy share link"
            >
              <FaLink size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleCopyToClipboard}
            className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted"
          >
            Copy
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted"
          >
            Share
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30"
            disabled={isGeneratingImage}
          >
            {isGeneratingImage ? "Generating..." : "Download"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;
