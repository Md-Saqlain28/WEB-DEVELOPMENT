import { ApiResponse } from "../utils/api_response.js";
import { asyncHandler } from "../utils/async-handlers.js";

/*
const healthCheck = async (req, res, next) => {
  try {
    const user = await getUserFromDB(); // Hypothetical function to check database connectivity
    res
      .status(200)
      .json(new ApiResponse(200, { message: "Server is running" }));
  } catch (error) {
    next(error);
  }
};
*/

const healthCheck = asyncHandler(async (req, res) => {
  // You can add any health check logic here, such as checking database connectivity
  res
  .status(200)
  .json(new ApiResponse(200, { message: "Server is running" }));
});

export { healthCheck };
