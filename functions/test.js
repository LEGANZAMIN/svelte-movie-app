exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      name: "leganza",
      age: 40,
      email: "lsmin01@gmail.com"
    })
  }
}