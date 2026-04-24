import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { TextInput } from "../ui/text-input";

const createLinkSchema = z.object({
  originalUrl: z.string().url("Please enter a valid URL"),
  shortUrl: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(30, "Maximum 30 characters")
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Only lowercase letters, numbers, and hyphens"),
});

export type CreateLinkFormValues = z.infer<typeof createLinkSchema>;

type CreateLinkFormProps = {
  isSubmitting: boolean;
  onSubmit: (values: CreateLinkFormValues) => Promise<void> | void;
};

export const CreateLinkForm = ({ isSubmitting, onSubmit }: CreateLinkFormProps) => {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CreateLinkFormValues>({
    defaultValues: {
      originalUrl: "",
      shortUrl: "",
    },
    resolver: zodResolver(createLinkSchema),
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
    reset();
  });

  return (
    <section className="panel" aria-labelledby="create-link-title">
      <div className="panel-header">
        <p className="eyebrow">Novo Link</p>
        <h1 id="create-link-title" className="panel-title">
          Encurtador de URL
        </h1>
      </div>

      <form className="link-form" onSubmit={submit} noValidate>
        <div className="field-group">
          <label className="field-label" htmlFor="originalUrl">
            URL original
          </label>
          <TextInput
            id="originalUrl"
            aria-invalid={Boolean(errors.originalUrl)}
            placeholder="https://example.com/artigo"
            {...register("originalUrl")}
          />
          {errors.originalUrl ? (
            <p className="field-error" role="alert">
              {errors.originalUrl.message}
            </p>
          ) : null}
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="shortUrl">
            URL encurtada
          </label>
          <TextInput
            id="shortUrl"
            aria-invalid={Boolean(errors.shortUrl)}
            placeholder="meu-link"
            {...register("shortUrl")}
          />
          {errors.shortUrl ? (
            <p className="field-error" role="alert">
              {errors.shortUrl.message}
            </p>
          ) : null}
        </div>

        <Button className="form-submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? <Spinner aria-label="Criando link" /> : null}
          <span>{isSubmitting ? "Salvando..." : "Salvar link"}</span>
        </Button>
      </form>
    </section>
  );
};
