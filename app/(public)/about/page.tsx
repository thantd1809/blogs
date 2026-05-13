import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Về tôi",
};

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold">Về tôi</h1>
      <p className="text-muted-foreground leading-relaxed">
        Xin chào! Tôi là một lập trình viên đam mê công nghệ.
        Trên blog này tôi chia sẻ kiến thức lập trình, kinh nghiệm làm việc và những điều thú vị trong cuộc sống.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        Nếu bạn muốn liên hệ, hãy nhắn tin qua Zalo hoặc email cho tôi.
      </p>
    </div>
  );
}
