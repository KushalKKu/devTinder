const express = require('express');

const app = express();
// const cors = require('cors');

app.use((req, res, next) => {
    console.log("Hello from server middleware")
}
)

app.listen(7777,()=>{
    console.log("Server is running on port 7777")
})