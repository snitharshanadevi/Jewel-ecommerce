import { runAllTests } from './userFlowTests';

async function main() {
  console.log('--- RUNNING AUREVYA AUTOMATED FLOW TESTS ---');
  const { passed, failed, results } = await runAllTests();
  results.forEach((r) => console.log(r));
  console.log(`\nTEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    throw new Error(`${failed} tests failed`);
  }
}

main();
