import type { PropsWithChildren } from "react";
import { Header } from "./header";
import { Github, Linkedin, Mail } from "lucide-react";

const links = [
  {
    href: "https://www.linkedin.com/in/praveenraj-sde/",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://github.com/praveen-raj-r/hostr",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "mailto:praveen1220raj@gmail.com",
    label: "Email",
    icon: Mail,
  },
];

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="weather-bg flex min-h-screen flex-col transition-colors duration-500">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-14 pt-5 sm:px-7 sm:pt-7 lg:px-12">
        {children}
      </main>

      <footer className="border-t" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto max-w-[1280px] px-4 py-7 sm:px-7 lg:px-12">
          <div className="flex flex-col-reverse items-center justify-between gap-5 sm:flex-row">
            <p className="text-center text-sm text-muted-foreground sm:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-foreground">Weatherly</span> ✦
              Built & Maintained by{" "}
              <span className="font-semibold text-foreground">Praveen Raj</span>
            </p>

            <div className="flex items-center gap-2">
              {links.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  aria-label={label}
                  title={label}
                  className="glass group inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition hover:-translate-y-0.5 hover:text-brand"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
