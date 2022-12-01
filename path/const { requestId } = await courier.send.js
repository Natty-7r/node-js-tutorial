const { requestId } = await courier.send({
    message: {
      to: {
        data: {
          name: "Marty",
        },
        email: "marty_mcfly@email.com",
      },
      content: {
        title: "Back to the Future",
        body: "Oh my {{name}}, we need 1.21 Gigawatts!",
      },
      routing: {
        method: "single",
        channels: ["email"],
      },
    },
  });
      }
      // sender();
      
  
  };
  