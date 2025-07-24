
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background text-card-foreground border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-headline text-lg font-bold">
              Vincent Designs Studio
            </h3>
            <p className="mt-2 text-sm text-muted-foreground text-balance">
              Specializing in bespoke graphic and web design, we build exceptional brands and websites for businesses ready to make their mark.
            </p>
          </div>
          <div>
            <h4 className="font-headline font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
               <li>
                <Link
                  href="/services"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-semibold">Contact Us</h4>
            <p className="text-sm mt-4 text-muted-foreground">
              vincentdesigns137@gmail.com
            </p>
            <p className="text-sm mt-2 text-muted-foreground">
              +264 81 819 0591
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Vincent Designs Studio. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
