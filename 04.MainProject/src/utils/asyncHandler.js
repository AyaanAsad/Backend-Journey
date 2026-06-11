const asyncHandler = (func) => {
    return (req,res,next) => {
        Promise
        .resolve(func(req,res,next))
        .catch((err) => {console.log('Error : ',err)}) 
    }
}
//asyncHandler is a wrapper function. You hand it your route function, and it wraps it in a safety layer.

export {asyncHandler}