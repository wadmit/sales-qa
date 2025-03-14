"use client";

import type React from "react";

import { useState } from "react";
import axios from "axios"; // Add this import
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
  const [userType, setUserType] = useState("student");
  const [isLoading, setIsLoading] = useState(false);

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
          type: userType,
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
      setUserType("student");
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
              <Label htmlFor="userType">User Type</Label>
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger id="userType">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                </SelectContent>
              </Select>
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
