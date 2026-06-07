import { supabase } from "@/lib/supabase";

export async function getMyReferralCode(
  userId: string
) {

  const { data, error } =
    await supabase
      .from("profiles")
      .select(
        "referral_code"
      )
      .eq(
        "id",
        userId
      )
      .single();

  if (error) {

    console.error(error);

    return null;
  }

  return data?.referral_code;
}

export async function getMyReferrals(
  userId: string
) {

  const { data, error } =
    await supabase
      .from("referrals")
      .select("*")
      .eq(
        "referrer_user_id",
        userId
      );

  if (error) {

    console.error(error);

    return [];
  }

  return data || [];
}

export async function getReferralStats(
  userId: string
) {

  const referrals =
    await getMyReferrals(
      userId
    );

  const successful =
    referrals.filter(
      (r) =>
        r.status ===
        "COMPLETED"
    );

  const points =
    successful.reduce(
      (
        total,
        referral
      ) =>
        total +
        Number(
          referral.reward_points || 0
        ),
      0
    );

  return {

    totalReferrals:
      referrals.length,

    successfulReferrals:
      successful.length,

    rewardPoints:
      points,

  };
}

export async function createReferral(
  referral: {
    referrer_user_id: string;
    referred_user_id: string;
    referral_code: string;
  }
) {

  const { error } =
    await supabase
      .from("referrals")
      .insert([{

        ...referral,

        reward_points:
          100,

        status:
          "PENDING",

      }]);

  if (error) {

    console.error(error);

    return false;
  }

  return true;
}

export async function markReferralCompleted(
  referralId: number
) {

  const { error } =
    await supabase
      .from("referrals")
      .update({

        status:
          "COMPLETED",

      })
      .eq(
        "id",
        referralId
      );

  if (error) {

    console.error(error);

    return false;
  }

  return true;
}