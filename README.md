# Y-Todos

This is a simple todo list project that allows multiple users to edit the same list simultaneously. It serves as a basic example project for the CRDT library [yjs](https://github.com/yjs/yjs/), which I built to easily test my open-source library, [y-mongodb-provider](https://github.com/MaxNoetzold/y-mongodb-provider).

Yjs enables users to work on the same data simultaneously, eliminating concerns about conflicts or inconsistencies. Moreover, Yjs is network-agnostic, which means it can be used with any networking layer or database. My open-source library connects Yjs with the MongoDB database to facilitate easy data storage and retrieval.

The project is built with Preact, Node (v20), MongoDB, and yjs, and is written in TypeScript.

The application is divided into a frontend and a backend. Separate `README` files are available for both parts.

## Installation

To install the project, clone the repository and install the dependencies in both the frontend and backend directories.

```sh
git clone https://github.com/MaxNoetzold/y-todo
cd frontend && npm install
cd ../backend && npm install
```

In both directories, there are `EXAMPLE.env` files that need to be copied, renamed to `.env`, and edited if necessary.

## Usage

The usage instructions are explained in the READMEs in the frontend and backend directories.

## Testing

Only the frontend has tests since the backend code consists solely of example codes from official yjs libraries. The frontend tests can be found next to each component.

To run them, use the following command:

```sh
npm test
```

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

[MIT](https://opensource.org/license/mit/)
