class apiError extends Error{ //1.1
    constructor( //1.2
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack =""
    ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success = false
        this.errors = errors

        if(stack){ // 1.3
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
// 1.1 :extends Error means: "start with everything a normal JS Error has, then add our own stuff on top."

// 1.2:
// 📌 statusCode — like 404, 500, etc.
// 📌 message — human readable explanation. Defaults to "Something went wrong"
// 📌 errors — a list of extra error details. Defaults to empty list []
// 📌 stack — technical trail of where the error happened. Defaults to empty string

// 1.3:
// A stack trace is like a breadcrumb trail — it tells you exactly which lines of code led to the error.
// If you manually passed a stack → use that.
// If you didn't → let JavaScript automatically capture it with captureStackTrace.
// The second argument this.constructor tells it: "start the trail from where the error was created, not from inside this class itself." Keeps the trace clean.

export {apiError}