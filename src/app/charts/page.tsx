import Chart1 from '@/components/Chart/Chart';

export default function ChartsPage() {
  return (
    <div className='md:mx-20 place-items-center justify-center items-center w-full'>
      <h1 className='text-center items-center place-items-center text-3xl semi-bold mt-10'>Charts</h1>
      <div className='grid md:grid-cols-2 max-md:grid-rows-2 place-items-center'>
        <Chart1 />
      </div>
    </div>
  );
}
