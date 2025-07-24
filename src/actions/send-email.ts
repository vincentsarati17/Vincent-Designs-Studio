'use server';

import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  service: z.string().min(1, { message: "Please select a service." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

export async function handleFormSubmission(values: FormValues) {
  const parsedData = formSchema.safeParse(values);

  if (!parsedData.success) {
    return { success: false, message: 'Invalid data.' };
  }

  // In a real application, you would integrate an email service here.
  // For example, using a service like Resend, Nodemailer, or SendGrid.
  //
  // Example with Resend:
  //
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  //
  // try {
  //   await resend.emails.send({
  //     from: 'onboarding@resend.dev',
  //     to: 'vincentdesigns137@gmail.com',
  //     subject: `New message from ${parsedData.data.name} via your website`,
  //     html: `<p>Name: ${parsedData.data.name}</p>
  //            <p>Email: ${parsedData.data.email}</p>
  //            <p>Service: ${parsedData.data.service}</p>
  //            <p>Message: ${parsedData.data.message}</p>`,
  //   });
  //   return { success: true };
  // } catch (error) {
  //   console.error('Email sending failed:', error);
  //   return { success: false, message: 'Failed to send email.' };
  // }

  // For now, we will just log the data to the server console.
  console.log('New form submission:');
  console.log('Name:', parsedData.data.name);
  console.log('Email:', parsedData.data.email);
  console.log('Service:', parsedData.data.service);
  console.log('Message:', parsedData.data.message);

  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return { success: true };
}
