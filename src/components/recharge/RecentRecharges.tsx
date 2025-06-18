
import React from 'react';

const RecentRecharges = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{"id": "1"}');
  const allRequests = JSON.parse(localStorage.getItem('rechargeRequests') || '[]');
  const userRecharges = allRequests
    .filter((req: any) => req.userId === currentUser.id)
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2">Recent Recharges</h3>
      <div className="space-y-2">
        {userRecharges.length > 0 ? (
          userRecharges.map((recharge: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <p className="text-sm font-medium">{new Date(recharge.date).toLocaleDateString()}</p>
                <p className="text-xs text-gray-500">₹{recharge.amount}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                recharge.status === 'approved' 
                  ? 'bg-green-100 text-green-800' 
                  : recharge.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                {recharge.status === 'approved' 
                  ? 'Successful' 
                  : recharge.status === 'rejected'
                    ? 'Rejected'
                    : 'Pending'}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No recent recharges found</p>
        )}
      </div>
    </div>
  );
};

export default RecentRecharges;
