import { useRouter } from "next/router";

export default function About() {
  const { locale } = useRouter();

  return <main className="flex justify-center text-2xl">About page: {locale}</main>;
}
