
import { cn } from "@/lib/utils";

interface ColorSectionProps {
  children: React.ReactNode;
  className?: string;
  bgClassName?: "bg-background" | "bg-muted" | "bg-primary" | "bg-card";
  variant?: "default" | "primary" | "muted" | "card";
}

export function ColorSection({
  children,
  className,
  bgClassName = "bg-background",
  variant = "default",
}: ColorSectionProps) {
  return (
    <section 
      className={cn(
        "py-16",
        bgClassName,
        className
      )}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  );
}

export function ColorHeading({
  children,
  className,
  level = 2,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: "default" | "primary" | "muted" | "card";
}) {
  const baseClasses = "font-bold";
  const variantClasses = {
    default: "text-foreground",
    primary: "text-primary-foreground",
    muted: "text-muted-foreground",
    card: "text-card-foreground",
  };
  
  const sizeClasses = {
    1: "text-4xl sm:text-5xl mb-6",
    2: "text-3xl mb-6",
    3: "text-2xl mb-4",
    4: "text-xl mb-3",
    5: "text-lg mb-2",
    6: "text-base mb-2",
  };

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[level],
        className
      )}
    >
      {children}
    </HeadingTag>
  );
}

export function ColorText({
  children,
  className,
  variant = "default",
  size = "base",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "primary" | "muted" | "card";
  size?: "sm" | "base" | "lg" | "xl";
}) {
  const variantClasses = {
    default: "text-foreground",
    primary: "text-primary-foreground",
    muted: "text-muted-foreground",
    card: "text-card-foreground",
  };
  
  const sizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <p
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </p>
  );
}

export function ColorHero({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn(
      "pt-16 pb-12 bg-gradient-to-b from-background to-muted",
      className
    )}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {children}
        </div>
      </div>
    </section>
  );
}
