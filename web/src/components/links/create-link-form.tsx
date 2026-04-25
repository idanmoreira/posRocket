import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { TextInput } from "../ui/text-input";

const createLinkSchema = z.object({
  originalUrl: z.string().url("Informe uma URL válida"),
  shortUrl: z
    .string()
    .min(3, "Mínimo de 3 caracteres")
    .max(30, "Máximo de 30 caracteres")
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Use apenas letras minúsculas, números e hífens"),
});

export type CreateLinkFormValues = z.infer<typeof createLinkSchema>;

type CreateLinkFormProps = {
  isSubmitting: boolean;
  onSubmit: (values: CreateLinkFormValues) => Promise<void> | void;
};

const SLUG_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

const generateRandomSlug = (length = 8) => {
  let slug = "";
  for (let index = 0; index < length; index += 1) {
    slug += SLUG_ALPHABET[Math.floor(Math.random() * SLUG_ALPHABET.length)];
  }
  return slug;
};

const slugifyHostname = (urlString: string) => {
  try {
    const parsed = new URL(urlString);
    const base = parsed.hostname
      .toLowerCase()
      .replace(/^www\./, "")
      .split(".")[0]
      ?.replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!base || base.length < 2) {
      return null;
    }

    return base.slice(0, 20);
  } catch {
    return null;
  }
};

const generateSlugFromUrl = (urlString: string) => {
  const base = slugifyHostname(urlString);
  const suffix = generateRandomSlug(4);

  if (!base) {
    return generateRandomSlug();
  }

  return `${base}-${suffix}`.slice(0, 30);
};

export const CreateLinkForm = ({ isSubmitting, onSubmit }: CreateLinkFormProps) => {
  const {
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<CreateLinkFormValues>({
    defaultValues: {
      originalUrl: "",
      shortUrl: "",
    },
    resolver: zodResolver(createLinkSchema),
  });

  const slugTouchedRef = useRef(false);
  const originalUrl = watch("originalUrl");

  useEffect(() => {
    if (slugTouchedRef.current) {
      return;
    }

    if (!originalUrl) {
      return;
    }

    try {
      new URL(originalUrl);
    } catch {
      return;
    }

    const currentSlug = getValues("shortUrl");
    if (currentSlug) {
      return;
    }

    const generated = generateSlugFromUrl(originalUrl);
    setValue("shortUrl", generated, { shouldValidate: true });
  }, [getValues, originalUrl, setValue]);

  const handleSlugChange = () => {
    slugTouchedRef.current = true;
  };

  const handleRegenerateSlug = () => {
    slugTouchedRef.current = false;
    const generated = generateSlugFromUrl(getValues("originalUrl"));
    setValue("shortUrl", generated, { shouldValidate: true });
  };

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
    slugTouchedRef.current = false;
    reset();
  });

  const slugRegister = register("shortUrl");

  return (
    <section className="panel" aria-labelledby="create-link-title">
      <div className="panel-header">
        <p className="brand-mark">posRocket</p>
        <h1 id="create-link-title" className="panel-title">
          Encurte uma URL longa
        </h1>
        <p className="panel-description">
          Transforme links grandes em URLs curtas, fáceis de compartilhar e acompanhar.
        </p>
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
          <div className="field-label-row">
            <label className="field-label" htmlFor="shortUrl">
              URL encurtada
            </label>
            <button
              className="field-label-action"
              onClick={handleRegenerateSlug}
              type="button"
            >
              Gerar novo
            </button>
          </div>
          <div className="slug-input-wrap">
            <span className="slug-prefix">posrocket/</span>
            <TextInput
              id="shortUrl"
              aria-invalid={Boolean(errors.shortUrl)}
              placeholder="gerado-automaticamente"
              {...slugRegister}
              onChange={(event) => {
                handleSlugChange();
                slugRegister.onChange(event);
              }}
            />
          </div>
          <p className="field-hint">
            Preencha a URL original e o slug é sugerido automaticamente. Você pode editar ou gerar outro.
          </p>
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
