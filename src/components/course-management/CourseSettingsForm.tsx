
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const courseSettingsSchema = z.object({
  difficulty: z.string().min(1, "Difficulty level is required"),
  duration: z.string().min(1, "Duration is required"),
  price: z.string().min(1, "Price is required"),
});

type CourseSettingsFormData = z.infer<typeof courseSettingsSchema>;

interface CourseSettingsFormProps {
  onSubmit: (data: CourseSettingsFormData) => void;
  onBack?: () => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<CourseSettingsFormData>;
}

export function CourseSettingsForm({ onSubmit, onBack, isSubmitting, defaultValues }: CourseSettingsFormProps) {
  const form = useForm<CourseSettingsFormData>({
    resolver: zodResolver(courseSettingsSchema),
    defaultValues: {
      difficulty: '',
      duration: '',
      price: '',
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty Level *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., 8 weeks" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., $199" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 pt-6">
          {onBack && (
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Adding Course..." : "Add Course"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
