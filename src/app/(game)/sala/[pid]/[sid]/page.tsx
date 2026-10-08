import View from "@/views/sala.$pid.$sid";
import { notFound } from "next/navigation";
import { getPyramid, PYRAMIDS } from "@/game/data";
export const dynamicParams = false;
export function generateStaticParams() {
  return PYRAMIDS.flatMap((p) => p.rooms.map((r) => ({ pid: p.id, sid: r.id })));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ pid: string; sid: string }>;
}) {
  const { pid, sid } = await params;
  const pyramid = getPyramid(pid);
  const title = pyramid?.rooms.find((r) => r.id === sid)?.name;
  return { title: title || "Pirâmide" };
}
export default async function Page({ params }: { params: Promise<{ pid: string; sid: string }> }) {
  const { pid, sid } = await params;
  const pyramid = getPyramid(pid);
  if (!pyramid || !pyramid.rooms.some((r) => r.id === sid)) notFound();
  return <View pid={pid} sid={sid} />;
}
