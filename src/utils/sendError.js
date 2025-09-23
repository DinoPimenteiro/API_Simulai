export default function sendError(res, message = "Unexpected error.", statusCode = "500", error = "INTERNAL_ERROR"){

    res.status(statusCode).json({
      success: false,
      error: {
        code: error,
        message
      }
    })
    
}

  
