interface Props {
  winners_data: any[];
}

export default function WinnersTable(props: Props) {
  return (
    <div className="w-[100%] flex flex-col">
      <div className="sm:mx-6 lg:mx-8 ">
        <div className="py-4 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden ">
            <table className="min-w-full text-center ">
              <thead className="border-b bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-white px-6 py-4"
                  >
                    Spin Date
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-white px-6 py-4"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-white px-6 py-4"
                  >
                    Spin No
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-white px-6 py-4"
                  >
                    Winner
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-white px-6 py-4"
                  >
                    Rank
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-white px-6 py-4"
                  >
                    Prize
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.winners_data.length &&
                  props.winners_data.map((row) => {
                    return (
                      <tr>
                        <td className="text-sm font-medium text-white px-6 py-4">
                          {row.day}
                        </td>
                        <td className="text-sm font-medium text-white px-6 py-4">
                          {row.type}
                        </td>
                        <td className="text-sm font-medium text-white px-6 py-4">
                          {row.spin}
                        </td>
                        <td className="text-sm font-medium text-white px-6 py-4">
                          {row.wallet_id}
                        </td>
                        <td className="text-sm font-medium text-white px-6 py-4">
                          {row.rank}
                        </td>
                        <td className="text-sm font-medium text-white px-6 py-4">
                          ${row.prize}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {!props.winners_data.length && (
              <>
                <p
                  style={{
                    padding: "4rem",
                    fontSize: "1.4rem",
                    margin: "auto",
                    textAlign: "center",
                  }}
                  className="text-white "
                >
                  No winners
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
