import ContactForm from '@/components/ContactForm';
import { Mail, Phone } from 'lucide-react';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
)

export default function ContactPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-balance">Get in Touch</h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          Have a project in mind? We'd love to hear from you. Fill out the form below, and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="mt-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
            <ContactForm />
        </div>
        <div className="space-y-8">
            <div>
                <h3 className="font-headline text-xl font-semibold flex items-center gap-2"><Mail size={20} className="text-primary"/> Email</h3>
                <a href="mailto:vincentdesigns137@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors mt-2 block">vincentdesigns137@gmail.com</a>
            </div>
            <div>
                <h3 className="font-headline text-xl font-semibold flex items-center gap-2"><Phone size={20} className="text-primary"/> Phone</h3>
                <p className="text-muted-foreground mt-2">+264 81 819 0591</p>
            </div>
            <div>
                <h3 className="font-headline text-xl font-semibold flex items-center gap-2"><WhatsAppIcon className="w-5 h-5 text-primary"/> WhatsApp</h3>
                <a href="https://wa.me/264818190591" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors mt-2 block">Message us on WhatsApp</a>
            </div>
            <div>
                <h3 className="font-headline text-xl font-semibold">Location</h3>
                <p className="text-muted-foreground mt-2">Based in Rundu, Namibia</p>
                <div className="mt-4 aspect-video w-full bg-muted rounded-lg overflow-hidden border">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30598.66533722476!2d19.75402377488349!3d-17.92576921319089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a33742461397feb%3A0x57766c3c5443e993!2sRundu%2C%20Namibia!5e0!3m2!1sen!2sus!4v1719597375225!5m2!1sen!2sus"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="grayscale contrast-125 opacity-70"
                    ></iframe>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
