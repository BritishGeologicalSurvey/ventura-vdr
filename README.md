<div align="center">
	<h1>VENTURA</h1>
  <h2>Virtual Decision Room (VDR)</h2>
</div>
<div align="center">
	<p align="center">
		A system to enable local government, the local community and other relevant partners such as regulators and water utility companies to collaboratively plan and evaluate the environmental sustainability of urban growth planning scenarios using co-designed water neutrality indicators.
		<br />
	</p>
</div>
<hr>

## Get started

### Prerequisites

- Angular
- PNPM

### Local Development

To run the VENTURA VDR locally you can run the application with the following commands

```bash
# Clone VDR repo
git clone https://github.com/<THIS_REPO>

# Navigate to project directory
cd vdr-foss

# Install dependencies
pnpm install

# Run the VDR
pnpm run start
```
### Testing

To run the testts:

```bash

# Option 1. Start the local server, run the tests then close down
pnpm run ci-e2e

# Option 2. Start the server in terminal A then run the tests in terminal B
pnpm run start
pnpm run e2e

```

