const errorHandler = function(callback){
    return async (req,res,next) => {
        try{
            await callback(req,res);
        } catch(err){
            console.log(err);
            next(err);
        }
    }
}

module.exports = errorHandler;