import Link from "next/link";

export default async function ReposPage() {
  const repos = [];
  return (
    <div className="flex flex-col items-stretch mt-16 gap-8">
      <Link className="self-start btn-primary" href={"/repos/propose"}>
        Propose repo
      </Link>
      <table className="table-auto self-center w-full">
        <thead className="text-left">
          <tr>
            <th>Name</th>
            <th>Owner</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Linux</td>
            <td>torval</td>
            <td>10000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
