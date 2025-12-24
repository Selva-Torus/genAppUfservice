'use client'

import React, { useContext,useEffect } from 'react' 
import { Icon } from '@/components/Icon';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';

const IconcardIcon2 = ({encryptionFlagCompData}:any) => {
  const token:string = getCookie('token'); 
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method
  /////////////
  //another screen
  const {herosection5b0f3, setherosection5b0f3}= useContext(TotalContext) as TotalContextProps
  const {herosection5b0f3Props, setherosection5b0f3Props}= useContext(TotalContext) as TotalContextProps
  const {herosectioncontent0b52c, setherosectioncontent0b52c}= useContext(TotalContext) as TotalContextProps
  const {herosectioncontent0b52cProps, setherosectioncontent0b52cProps}= useContext(TotalContext) as TotalContextProps
  const {hersectioncontentcard68df4, sethersectioncontentcard68df4}= useContext(TotalContext) as TotalContextProps
  const {hersectioncontentcard68df4Props, sethersectioncontentcard68df4Props}= useContext(TotalContext) as TotalContextProps
  const {hersectioncontentcard1b9c4a, sethersectioncontentcard1b9c4a}= useContext(TotalContext) as TotalContextProps
  const {hersectioncontentcard1b9c4aProps, sethersectioncontentcard1b9c4aProps}= useContext(TotalContext) as TotalContextProps
  const {hersectioncontentcard2cd13f, sethersectioncontentcard2cd13f}= useContext(TotalContext) as TotalContextProps
  const {hersectioncontentcard2cd13fProps, sethersectioncontentcard2cd13fProps}= useContext(TotalContext) as TotalContextProps
  const {cardicon20cb06, setcardicon20cb06}= useContext(TotalContext) as TotalContextProps
  const {cardtext23d68e, setcardtext23d68e}= useContext(TotalContext) as TotalContextProps
  const {cardsubtext23c206, setcardsubtext23c206}= useContext(TotalContext) as TotalContextProps
  const {hersectioncontentcard39a879, sethersectioncontentcard39a879}= useContext(TotalContext) as TotalContextProps
  const {hersectioncontentcard39a879Props, sethersectioncontentcard39a879Props}= useContext(TotalContext) as TotalContextProps
  const {aboutsection3edbb, setaboutsection3edbb}= useContext(TotalContext) as TotalContextProps
  const {aboutsection3edbbProps, setaboutsection3edbbProps}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontent3ada4, setaboutsectioncontent3ada4}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontent3ada4Props, setaboutsectioncontent3ada4Props}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentimg1c0718, setaboutsectioncontentimg1c0718}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentimg1c0718Props, setaboutsectioncontentimg1c0718Props}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentimgcard1df84, setaboutsectioncontentimgcard1df84}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentimgcard1df84Props, setaboutsectioncontentimgcard1df84Props}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentheadingwrapper82b26, setaboutsectioncontentheadingwrapper82b26}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentheadingwrapper82b26Props, setaboutsectioncontentheadingwrapper82b26Props}= useContext(TotalContext) as TotalContextProps
  const {about_section_content_card_10975b, setabout_section_content_card_10975b}= useContext(TotalContext) as TotalContextProps
  const {about_section_content_card_10975bProps, setabout_section_content_card_10975bProps}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentcard1iconwrapper885d6, setaboutsectioncontentcard1iconwrapper885d6}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentcard1iconwrapper885d6Props, setaboutsectioncontentcard1iconwrapper885d6Props}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentimg26f2bf, setaboutsectioncontentimg26f2bf}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentimg26f2bfProps, setaboutsectioncontentimg26f2bfProps}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentimg35e371, setaboutsectioncontentimg35e371}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentimg35e371Props, setaboutsectioncontentimg35e371Props}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentcard2bb8af, setaboutsectioncontentcard2bb8af}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentcard2bb8afProps, setaboutsectioncontentcard2bb8afProps}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentcard2iconwrapper90155, setaboutsectioncontentcard2iconwrapper90155}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentcard2iconwrapper90155Props, setaboutsectioncontentcard2iconwrapper90155Props}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentcards42230, setaboutsectioncontentcards42230}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentcards42230Props, setaboutsectioncontentcards42230Props}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentcardsproject39023, setaboutsectioncontentcardsproject39023}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentcardsproject39023Props, setaboutsectioncontentcardsproject39023Props}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentcardscllient4f691, setaboutsectioncontentcardscllient4f691}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentcardscllient4f691Props, setaboutsectioncontentcardscllient4f691Props}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentcardsteamcea5d, setaboutsectioncontentcardsteamcea5d}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentcardsteamcea5dProps, setaboutsectioncontentcardsteamcea5dProps}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentcardscustomer2cf01, setaboutsectioncontentcardscustomer2cf01}= useContext(TotalContext) as TotalContextProps
  const {aboutsectioncontentcardscustomer2cf01Props, setaboutsectioncontentcardscustomer2cf01Props}= useContext(TotalContext) as TotalContextProps
  const {servicesectionc7118, setservicesectionc7118}= useContext(TotalContext) as TotalContextProps
  const {servicesectionc7118Props, setservicesectionc7118Props}= useContext(TotalContext) as TotalContextProps
  const {servicesectioncontent29fb3, setservicesectioncontent29fb3}= useContext(TotalContext) as TotalContextProps
  const {servicesectioncontent29fb3Props, setservicesectioncontent29fb3Props}= useContext(TotalContext) as TotalContextProps
  const {dd2e0, setdd2e0}= useContext(TotalContext) as TotalContextProps
  const {dd2e0Props, setdd2e0Props}= useContext(TotalContext) as TotalContextProps
  const {d29fb, setd29fb}= useContext(TotalContext) as TotalContextProps
  const {d29fbProps, setd29fbProps}= useContext(TotalContext) as TotalContextProps
  const {688bb, set688bb}= useContext(TotalContext) as TotalContextProps
  const {688bbProps, set688bbProps}= useContext(TotalContext) as TotalContextProps
  const {securityicon3bde5, setsecurityicon3bde5}= useContext(TotalContext) as TotalContextProps
  const {securityicon3bde5Props, setsecurityicon3bde5Props}= useContext(TotalContext) as TotalContextProps
  const {iconwrapper5dce2, seticonwrapper5dce2}= useContext(TotalContext) as TotalContextProps
  const {iconwrapper5dce2Props, seticonwrapper5dce2Props}= useContext(TotalContext) as TotalContextProps
  const {c5619, setc5619}= useContext(TotalContext) as TotalContextProps
  const {c5619Props, setc5619Props}= useContext(TotalContext) as TotalContextProps
  const {1e67b, set1e67b}= useContext(TotalContext) as TotalContextProps
  const {1e67bProps, set1e67bProps}= useContext(TotalContext) as TotalContextProps
  const {4a692, set4a692}= useContext(TotalContext) as TotalContextProps
  const {4a692Props, set4a692Props}= useContext(TotalContext) as TotalContextProps
  const {28b18, set28b18}= useContext(TotalContext) as TotalContextProps
  const {28b18Props, set28b18Props}= useContext(TotalContext) as TotalContextProps
  const {1d2f0, set1d2f0}= useContext(TotalContext) as TotalContextProps
  const {1d2f0Props, set1d2f0Props}= useContext(TotalContext) as TotalContextProps
  const {c713c, setc713c}= useContext(TotalContext) as TotalContextProps
  const {c713cProps, setc713cProps}= useContext(TotalContext) as TotalContextProps
  const {testingsectionfd8df, settestingsectionfd8df}= useContext(TotalContext) as TotalContextProps
  const {testingsectionfd8dfProps, settestingsectionfd8dfProps}= useContext(TotalContext) as TotalContextProps
  const {a3963, seta3963}= useContext(TotalContext) as TotalContextProps
  const {a3963Props, seta3963Props}= useContext(TotalContext) as TotalContextProps
  const {a0ca9, seta0ca9}= useContext(TotalContext) as TotalContextProps
  const {a0ca9Props, seta0ca9Props}= useContext(TotalContext) as TotalContextProps
  const {84e59, set84e59}= useContext(TotalContext) as TotalContextProps
  const {84e59Props, set84e59Props}= useContext(TotalContext) as TotalContextProps
  const {ad050, setad050}= useContext(TotalContext) as TotalContextProps
  const {ad050Props, setad050Props}= useContext(TotalContext) as TotalContextProps
  const {04eb2, set04eb2}= useContext(TotalContext) as TotalContextProps
  const {04eb2Props, set04eb2Props}= useContext(TotalContext) as TotalContextProps
  const {acdf4, setacdf4}= useContext(TotalContext) as TotalContextProps
  const {acdf4Props, setacdf4Props}= useContext(TotalContext) as TotalContextProps
  const {f377d, setf377d}= useContext(TotalContext) as TotalContextProps
  const {f377dProps, setf377dProps}= useContext(TotalContext) as TotalContextProps
  const {2c7d1, set2c7d1}= useContext(TotalContext) as TotalContextProps
  const {2c7d1Props, set2c7d1Props}= useContext(TotalContext) as TotalContextProps
  const {2d4f2, set2d4f2}= useContext(TotalContext) as TotalContextProps
  const {2d4f2Props, set2d4f2Props}= useContext(TotalContext) as TotalContextProps
  const {b38f9, setb38f9}= useContext(TotalContext) as TotalContextProps
  const {b38f9Props, setb38f9Props}= useContext(TotalContext) as TotalContextProps
  const {13f42, set13f42}= useContext(TotalContext) as TotalContextProps
  const {13f42Props, set13f42Props}= useContext(TotalContext) as TotalContextProps
  //////////////
  const handleCode=async () => {
    let code:any;
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:New_HomeScreen:AFVK:v1",  componentId:"654e84826ada4e4aa926755bac9cd13f",controlId:"a5697340e0684a96932b75d66b10cb06",isTable:false,accessProfile:accessProfile,from:"IconcardIcon_2"},{
      headers: {
        Authorization: `Bearer ${token}`
    }})
    code=orchestrationData?.data?.code
    if (code == '') {
      //toast(code?.data?.errorDetails?.message, 'danger')
      //return
    }  else if (code != '') {
      let codeStates: any = {}
      codeExecution(code,codeStates)
    }
  }

  useEffect(() => {
    handleCode()
  }, [])

  if (cardicon20cb06?.isHidden) {
    return <></>
  }

return (
  <div 
    style={{gridColumn: `2 / 5`,gridRow: `3 / 19`, gap:``, height: `100%`, overflow: 'auto'
 }} >
    <Icon 
      className=""
      size={45}
      data="MdOutlineSupervisedUserCircle"
    />
  </div>
  )
}

export default IconcardIcon2
