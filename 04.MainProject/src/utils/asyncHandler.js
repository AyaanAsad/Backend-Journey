const asyncHandler = (func) => {
    (req,res,next) => {
        Promise
        .resolve(func(req,res,next))
        .reject((err) => {console.log('Error : ',err)}) 
    }
}
//asyncHandler is a wrapper function. You hand it your route function, and it wraps it in a safety layer.

export {asyncHandler}