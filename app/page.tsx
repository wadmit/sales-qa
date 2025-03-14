"use client";

import type React from "react";

import { useState } from "react";
import axios from "axios";
// Add this import for multi-select
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function QuestionForm() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  // Change to array for multi-select
  const [userTypes, setUserTypes] = useState<string[]>(["student"]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const userTypeOptions = [
    { value: "student", label: "Student" },
    { value: "partner", label: "Partner" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Using axios instead of fetch
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL!,
        {
          question,
          answer,
          // Join the array into a comma-separated string
          type: userTypes.join(","),
        }
        // {
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // }
      );

      // Handle successful submission (axios puts response in data property)
      alert(
        `Success: ${response.data.message || "Data submitted successfully!"}`
      );
      setQuestion("");
      setAnswer("");
      setUserTypes(["student"]);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      // Handle error with more details (axios error responses are in error.response)
      if (error.response) {
        alert(
          `Failed: ${error?.response?.data?.message || "Failed to submit data"}`
        );
      } else {
        alert("An error occurred while submitting the form");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to toggle selection of user types
  const toggleUserType = (value: string) => {
    setUserTypes((current) => {
      if (current.includes(value)) {
        return current.filter((type) => type !== value);
      } else {
        return [...current, value];
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Collect Data</CardTitle>
          <CardDescription>
            Enter data to store in the knowledge base.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                placeholder="Type your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                placeholder="Answer will appear here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userType">Question By (Multi-select)</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {userTypes.length > 0
                      ? userTypes.map(type => 
                          userTypeOptions.find(option => option.value === type)?.label
                        ).join(", ")
                      : "Select user by..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search user types..." />
                    <CommandEmpty>No user type found.</CommandEmpty>
                    <CommandGroup>
                      {userTypeOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => {
                            toggleUserType(option.value);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              userTypes.includes(option.value) 
                                ? "opacity-100" 
                                : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
