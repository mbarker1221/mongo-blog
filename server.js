 BlogPost
      .findByIdAndRemove(req.params.id)
      .then(() => {
        console.log(`Deleted blog post with id \`${req.params.id}\``);
        res.status(204).end();
      });
  };