import Table from '@/components/Table/Table';

export default function HomePage() {
  return (
    <div className='md:mx-32 place-items-center justify-center items-center min-w-[375px]'>
      <h1 className='text-center items-center place-items-center text-4xl semi-bold mt-20'>Wallets and Profits</h1>
      <Table />
    </div>
  );
}
