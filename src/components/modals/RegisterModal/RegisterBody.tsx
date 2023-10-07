"use client";

import { FieldErrors } from "react-hook-form";

import Heading from "@/components/Heading";
import Input from "@/components/inputs/Input";

type Props = {
  isLoading: boolean;
  register: any;
  errors: FieldErrors;
};

export default function RegisterBody({ register, errors, isLoading }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to Airbnb" subtitle="Create an account!" />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );
}