import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectDemoProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function SelectDemo({ value, onValueChange }: SelectDemoProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a method" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Method</SelectLabel>
          <SelectItem value="gpay">G Pay</SelectItem>
          <SelectItem value="upi">UPI</SelectItem>
          <SelectItem value="emi">EMI</SelectItem>
          <SelectItem value="credit-card">Credit Card</SelectItem>
          <SelectItem value="phonepe">PhonePe</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
