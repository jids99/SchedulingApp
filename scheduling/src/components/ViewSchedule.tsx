import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { Button } from "@/components/ui/button"
import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';

type Schedule = {
  schedule_id: number;
  name: string;
  event_name: string;
  schedule_date: string;
  created_by: string;
  created_at?: string;
  updated_by: string;
  updated_at?: string;
  is_active: boolean;
};

const options: Intl.DateTimeFormatOptions = {
  timeZone: "Asia/Manila",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true
};

const formatDate = (localDate : string) => new Date(localDate).toLocaleDateString("en-PH", options);

const ViewSchedule = ({ schedule_id, goNext }: {schedule_id: any, goNext: () => void }) => {
  const [loading, setLoading] = useState(true);
    const [scheduleDetails, setScheduleDetails] = useState<Schedule | null>(null);

    const fetchSchedule = async () => {
        const { data, error } = await supabase
          .from('schedules')
          .select('*')
          .eq('schedule_id', schedule_id)
          .maybeSingle();
    
        if (!error) {
          return data;
        } else {
          console.error('Error fetching:', error);
        }
    
    }

    useEffect(() => {
    
        const fetchData = async () => {
          const data  = await fetchSchedule();
          setScheduleDetails(data);
          console.log(data);
        }; 
    
        fetchData();
        setLoading(false);
    
    }, []);
    
  if (loading) return <div>Loading...</div>;

  return (
    <>
        <div className='flex flex-col gap-2'>
            <div className='flex gap-2 justify-between items-center mb-2'>
                <div className='flex flex-col'>
                    <span className="text-xl font-bold tracking-tight"> 
                        {scheduleDetails?.name}  
                    </span>
                    <span className='text-sm'> Assigned </span>
                </div>
                <Button
                    // onClick={}
                    className="bg-red-400 items-center"
                >
                    <FontAwesomeIcon icon={faTrash} />
                                    {/* Delete */}
                </Button>
            </div>
            <div className='flex flex-col gap-2'>
                <p className='flex justify-between w-full'>
                    <b className='text-sm'> Event </b>
                    <span> {scheduleDetails?.event_name}  </span>
                </p>
                <hr />
                <p className='flex justify-between w-full'>
                    <b className='text-sm'> ID </b>
                    <span> {schedule_id}  </span>
                </p>
                <p className='flex justify-between w-full'>
                    <b className='text-sm'> Schedule Date </b>
                    <span> {scheduleDetails?.schedule_date}  </span>
                </p>
                <p className='flex justify-between w-full'>
                    <b className='text-sm'> Created by </b>
                    <span> {scheduleDetails?.created_by}  </span>
                </p>
                <p className='flex justify-between w-full'>
                    <b className='text-sm'> Created Date </b>
                    <span> {formatDate(scheduleDetails?.created_at ?? '')}  </span>
                </p>
                <p className='flex justify-between w-full'>
                    <b className='text-sm'> Updated by </b>
                    <span> {scheduleDetails?.updated_by}  </span>
                </p>
                <p className='flex justify-between w-full'>
                    <b className='text-sm'> Updated Date </b>
                    <span> {formatDate(scheduleDetails?.updated_at ?? '')}  </span>
                </p>
                <p className='flex justify-between w-full'>
                    <b className='text-sm'> Status </b>
                    <span> {scheduleDetails?.is_active ? 'Active' : 'Inactive'}  </span>
                </p>
                <Button
                    onClick={goNext}
                    className="my-4"
                >
                    <FontAwesomeIcon icon={faPen} />
                                    Edit
                </Button>
            </div>

            
        </div>
    </>
  )
}

export default ViewSchedule
