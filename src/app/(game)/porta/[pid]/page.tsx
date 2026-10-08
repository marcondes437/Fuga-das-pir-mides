import View from "@/views/porta.$pid";
import { notFound } from "next/navigation";
import { getPyramid, PYRAMIDS } from "@/game/data";
export const dynamicParams = false;
export function generateStaticParams() {
  return PYRAMIDS.map((p) => ({ pid: p.id }));
}
export async function generateMetadata({ params }: { params: Promise<{ pid: string }> }) {
  const { pid } = await params;
  const pyramid = getPyramid(pid);
  const title = pyramid?.name;
  return { title: title || "Pirâmide" };
}
export default async function Page({ params }: { params: Promise<{ pid: string }> }) {
  const { pid } = await params;
  const pyramid = getPyramid(pid);
  if (!pyramid) notFound();
  return <View pid={pid} />;
}
