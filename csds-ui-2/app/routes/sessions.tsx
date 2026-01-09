export default function Sessions({
  loaderData,
  actionData,
  params,
  matches,
}: any) {
  return (
    <>
      ----------------------------------
      <div>Sessions list</div>
      <div>
        ----------------------------------
        <h1>args from sessions component</h1>
        <p>Loader Data: {JSON.stringify(loaderData)}</p>
        <p>Action Data: {JSON.stringify(actionData)}</p>
        <p>Route Parameters: {JSON.stringify(params)}</p>
        <p>Matched Routes: {JSON.stringify(matches)}</p>
      </div>
    </>
  )
}
