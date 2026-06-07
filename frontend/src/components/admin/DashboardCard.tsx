type Props = {
  title: string;
  value: string | number;
};

export default function DashboardCard({
  title,
  value,
}: Props) {

  return (

    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

      <p className="mb-3 text-sm text-gray-400">
        {title}
      </p>

      <h3 className="text-3xl font-bold text-cyan-400">
        {value}
      </h3>

    </div>

  );
}