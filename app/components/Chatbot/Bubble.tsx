import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface BubbleProps {
  message: { content: string; role: "user" | "assistant" };
  model: "RabbiGPT" | "BuddhaGPT" | "PastorGPT";
}

const BADGE: Record<BubbleProps["model"], string> = {
  RabbiGPT: "✡️",
  BuddhaGPT: "☸️",
  PastorGPT: "✝️",
};

// Placeholder summaries for other perspectives
const PERSPECTIVE_SUMMARIES: Record<
  BubbleProps["model"],
  Record<string, string>
> = {
  RabbiGPT: {
    BuddhaGPT:
      "Buddhism teaches that suffering arises from attachment and can be overcome through the Eightfold Path. The goal is to achieve enlightenment by letting go of desires and practicing mindfulness.",
    PastorGPT:
      "Christianity emphasizes salvation through faith in Jesus Christ as the son of God. The teachings focus on love, forgiveness, and the promise of eternal life through Christ's sacrifice.",
  },
  BuddhaGPT: {
    RabbiGPT:
      "Judaism emphasizes the covenant between God and the Jewish people, following the Torah's guidance. It combines study of sacred texts with practical ethics and observance of mitzvot (commandments).",
    PastorGPT:
      "Christianity emphasizes salvation through faith in Jesus Christ as the son of God. The teachings focus on love, forgiveness, and the promise of eternal life through Christ's sacrifice.",
  },
  PastorGPT: {
    RabbiGPT:
      "Judaism emphasizes the covenant between God and the Jewish people, following the Torah's guidance. It combines study of sacred texts with practical ethics and observance of mitzvot (commandments).",
    BuddhaGPT:
      "Buddhism teaches that suffering arises from attachment and can be overcome through the Eightfold Path. The goal is to achieve enlightenment by letting go of desires and practicing mindfulness.",
  },
};

const Bubble: React.FC<BubbleProps> = ({ message, model }) => {
  const { content, role } = message;
  const [isOpen, setIsOpen] = useState(false);

  // Get the other two models
  const otherModels = Object.keys(BADGE).filter((m) => m !== model) as Array<
    "RabbiGPT" | "BuddhaGPT" | "PastorGPT"
  >;

  return (
    <div className="flex flex-col">
      <div
        className={`${
          role === "user"
            ? "bg-[rgb(225,224,255)] rounded-[20px_20px_0_20px] ml-auto"
            : "bg-[#dce7ff] rounded-[20px_20px_20px_0]"
        } m-2 p-2 text-[15px] border-none text-[#383838] shadow-md w-4/5 text-left`}
      >
        {role === "assistant" && <span className="mr-1.5">{BADGE[model]}</span>}
        {content}
      </div>

      {role === "assistant" && (
        <div className="ml-2 mb-4">
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="text-xs bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600"
              >
                View Perspectives
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80">
              <div className="p-3 relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    Other Perspectives
                  </span>
                  <Button
                    variant="link"
                    className="text-xs p-0 h-auto absolute top-3 right-3"
                    onClick={() => {}}
                  >
                    View More
                  </Button>
                </div>
                {otherModels.map((otherModel) => (
                  <div
                    key={otherModel}
                    className="mb-3 pb-3 border-b last:border-0 last:mb-0 last:pb-0"
                  >
                    <div className="flex items-center mb-1">
                      <span className="mr-1">{BADGE[otherModel]}</span>
                      <span className="font-semibold">{otherModel}</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {PERSPECTIVE_SUMMARIES[model][otherModel]}
                    </p>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default Bubble;
