// sig-builder.js — shared signature HTML builder
(function (global) {
  const FONT_STACK = {
    'Tahoma':          'Tahoma, Geneva, sans-serif',
    'Arial':           'Arial, Helvetica, sans-serif',
    'Helvetica':       'Helvetica Neue, Helvetica, Arial, sans-serif',
    'Verdana':         'Verdana, Geneva, sans-serif',
    'Georgia':         'Georgia, serif',
    'Times New Roman': 'Times New Roman, Times, serif',
    'Trebuchet MS':    'Trebuchet MS, sans-serif',
    'Calibri':         'Calibri, Candara, sans-serif',
  };

  global.buildSig = function (emp, settings, baseUrl) {
    // Typography
    const nameFont    = FONT_STACK[emp.name_font]    || FONT_STACK['Tahoma'];
    const titleFont   = FONT_STACK[emp.title_font]   || FONT_STACK['Tahoma'];
    const companyFont = FONT_STACK[emp.company_font] || FONT_STACK['Tahoma'];
    const contactFont = FONT_STACK[emp.contact_font] || FONT_STACK['Tahoma'];
    const nameSize    = emp.name_size    || 18;
    const nameWeight  = emp.name_weight  || '700';
    const titleSize   = emp.title_size   || 15;
    const titleWeight = emp.title_weight || '400';
    const companySize   = emp.company_size   || 16;
    const companyWeight = emp.company_weight || '700';
    const contactSize   = emp.contact_size   || 14;

    // Colors
    const labelColor   = emp.label_color   || '#F6921C';
    const companyColor = emp.company_color || emp.accent_color || '#26A9E1';
    const textColor    = '#414141';

    // Photo
    const photoShape  = settings?.photo_shape || emp.photo_shape || 'circle';
    const photoRadius = photoShape === 'circle' ? '50%' : '0px';

    // Master template data from settings
    const company             = settings?.company_name     || '';
    const companyPhone        = settings?.company_phone    || '';
    const companyPhoneLabel   = settings?.company_phone_label  || 'p:';
    const companyAddress      = settings?.company_address  || '';
    const companyAddress2     = settings?.company_address2 || '';
    const companyAddressLabel = settings?.company_address_label || 'a:';
    const website             = settings?.company_website  || '';
    const websiteLabel        = settings?.company_website_label || 'w:';
    const bannerUrl           = settings?.banner_url       || '';
    const bannerLink          = settings?.banner_link      || '';

    const websiteDisplay = website.replace(/^https?:\/\//i, '').replace(/\/$/, '');
    const websiteHref    = website ? (website.startsWith('http') ? website : 'https://' + website) : '#';

    // Logo proxy
    const hasLogo = settings?.company_logo_url;
    const logoSrc = hasLogo ? (baseUrl || '').replace(/\/$/, '') + '/logo' : null;

    // Photo cell
    const photoCell = emp.photo_url
      ? `<td style="text-transform:none;text-align:left;vertical-align:top;padding-right:10px;box-sizing:border-box;"><div style="color:#192234;font-size:14px;font-family:Montserrat,sans-serif;text-transform:none;text-align:left;direction:ltr;"><img style="width:147px;height:147px;max-width:100%;min-height:auto;min-width:auto;border-radius:${photoRadius};object-fit:cover;display:block;" alt="${emp.name || ''}" src="${emp.photo_url}" /></div></td>`
      : '';

    // Contact rows — single shared 2-column table so all values align
    const contactItems = [];

    if (emp.mobile) {
      const lbl = emp.mobile_label || 'm:';
      contactItems.push({ label: lbl, html: `<a style="color:${textColor};text-decoration:none;" href="tel:${emp.mobile}">${emp.mobile}</a>` });
    }
    if (companyPhone) {
      contactItems.push({ label: companyPhoneLabel, html: `<a style="color:${textColor};text-decoration:none;" href="tel:${companyPhone}">${companyPhone}</a>` });
    }
    if (companyAddress) {
      const addr2 = companyAddress2 ? `<br/><span style="color:${textColor};font-size:${contactSize}px;">${companyAddress2}</span>` : '';
      contactItems.push({ label: companyAddressLabel, html: `<span style="color:${textColor};font-size:${contactSize}px;line-height:normal;">${companyAddress}</span>${addr2}` });
    }
    if (website) {
      contactItems.push({ label: websiteLabel, html: `<a style="color:${companyColor};" rel="noopener noreferrer" target="_blank" href="${websiteHref}">${websiteDisplay}</a>` });
    }

    let contactRows = '';
    if (contactItems.length) {
      const tableRows = contactItems.map((item, i) => {
        const topPad = i === 0 ? '13px' : '3px';
        return `<tr><td style="vertical-align:top;white-space:nowrap;padding-top:${topPad};padding-right:4px;line-height:17.8px;"><div style="font-family:${contactFont};line-height:17.8px;"><span style="color:${labelColor};font-size:${contactSize}px;line-height:normal;">${item.label}</span></div></td><td style="vertical-align:top;padding-top:${topPad};line-height:17.8px;"><div style="font-family:${contactFont};font-size:${contactSize}px;line-height:17.8px;">${item.html}</div></td></tr>`;
      }).join('');
      contactRows = `<tr><td><table style="border-spacing:0;border-collapse:collapse;" cellpadding="0"><tbody>${tableRows}</tbody></table></td></tr>`;
    }

    // Social icons from master settings (up to 10 custom slots)
    const socialItems = [];
    for (let i = 1; i <= 10; i++) {
      const iconUrl = settings?.['social_' + i + '_icon_url'];
      const link    = settings?.['social_' + i + '_link'];
      if (iconUrl && link) socialItems.push({ iconUrl, link });
    }

    const socialCells = socialItems.map(item =>
      `<td style="text-transform:none;text-align:left;padding-right:5px;box-sizing:border-box;"><a rel="noopener noreferrer" target="_blank" href="${item.link}"><img style="vertical-align:top;display:block;width:24px;height:24px;max-width:100%;outline:0px;" alt="social" src="${item.iconUrl}" /></a></td>`
    ).join('');

    const logoSocialRow = socialItems.length
      ? `<tr><td style="padding-top:10px;"><table style="border-spacing:0;border-collapse:collapse;" cellpadding="0"><tbody><tr>${socialCells}</tr></tbody></table></td></tr>`
      : '';

    // Banner from master settings
    const bannerRow = bannerUrl
      ? `<tr><td style="text-transform:none;text-align:left;padding-top:10px;box-sizing:border-box;line-height:1px;"><span style="color:#192234;font-size:1px;font-family:Montserrat,sans-serif;">${bannerLink ? `<a rel="noopener noreferrer" target="_blank" href="${bannerLink}">` : ''}<img style="width:600px;max-width:100%;outline:0px;box-sizing:border-box;display:block;" alt="banner" src="${bannerUrl}" />${bannerLink ? '</a>' : ''}</span></td></tr>`
      : '';

    return `<table style="color:#192234;text-transform:none;text-align:left;background-color:white;width:600px;border-spacing:0px;border-collapse:collapse;box-sizing:border-box;" cellpadding="0">
<tbody>
<tr><td style="text-transform:none;text-align:left;box-sizing:border-box;">
<table style="text-transform:none;text-align:left;border-spacing:0;border-collapse:collapse;box-sizing:border-box;" cellpadding="0">
<tbody><tr>
${photoCell}
<td style="text-transform:none;text-align:left;vertical-align:top;box-sizing:border-box;">
<table style="text-transform:none;text-align:left;border-spacing:0;border-collapse:collapse;box-sizing:border-box;" cellpadding="0">
<tbody>
<tr><td style="text-transform:none;text-align:left;box-sizing:border-box;line-height:22.9px;"><div style="color:${textColor};font-size:${nameSize}px;font-family:${nameFont};text-transform:none;text-align:left;line-height:22.9px;"><span style="line-height:normal;font-weight:${nameWeight};">${emp.name || ''}</span></div></td></tr>
${emp.title ? `<tr><td style="text-transform:none;text-align:left;padding-top:3px;box-sizing:border-box;line-height:19.1px;"><div style="font-family:${titleFont};text-transform:none;text-align:left;line-height:19.1px;"><span style="color:${textColor};font-size:${titleSize}px;font-weight:${titleWeight};line-height:normal;">${emp.title}</span></div></td></tr>` : ''}
${emp.additional_text ? `<tr><td style="padding-top:2px;"><div style="font-family:${contactFont};font-size:${contactSize}px;color:#777;">${emp.additional_text}</div></td></tr>` : ''}
${company ? `<tr><td style="text-transform:none;text-align:left;padding-top:3px;box-sizing:border-box;line-height:20.4px;"><div style="font-family:${companyFont};text-transform:none;text-align:left;line-height:20.4px;"><span style="color:${companyColor};font-size:${companySize}px;font-weight:${companyWeight};line-height:normal;">${company}</span></div></td></tr>` : ''}
${contactRows}
${logoSocialRow}
</tbody>
</table>
</td>
</tr></tbody></table>
</td></tr>
${bannerRow}
</tbody></table>`;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buildSig: global.buildSig };
  }
})(typeof window !== 'undefined' ? window : global);
