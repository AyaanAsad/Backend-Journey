class ApiResponse{
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode,
        this.data = data,
        this.message = message,
        this.success = statusCode < 400
    }
}
//📌 statusCode — a number like 200 (ok) or 404 (not found)
//📌 data — the actual info you're sending back (like a user's profile)
//📌 message — a text note. Defaults to "Success" if you don't pass one
//this.success = statusCode < 400 automatically sets success to true or false based on the status code 