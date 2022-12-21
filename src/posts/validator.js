import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const postSchema = {
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field.",
    },
  },
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory field.",
    },
  },
  cover: {
    in: ["body"],
    isString: {
      errorMessage:
        "Cover is a mandatory field. Please supply a URL to an image.",
    },
  },
  author: {
    name: {
      in: ["body"],
      isString: {
        errorMessage: "Author name is a mandatory field.",
      },
    },
  },

  content: {
    in: ["body"],
    isString: {
      errorMessage: "Please supply valid post content.",
    },
  },
};

export const checkPostSchema = checkSchema(postSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Error during post validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
