import styled from '@emotion/styled';
import { colors, getSpacing, typography } from '@statseeker/ui/theme';
import { type ReactElement } from 'react';


const StyledLabel = styled.label`
   margin-bottom: ${getSpacing('sm')};
   font-size: ${typography.label.fontSize};
   font-family: ${typography.label.fontFamily};
   font-size: ${typography.label.fontSize};
   font-weight: ${typography.label.fontWeight};
   text-transform: ${typography.label.textTransform};
   line-height: ${typography.label.lineHeight};
   color: ${typography.label.color};
   letter-spacing: ${typography.label.letterSpacing};
`;

const RequiredIndicator = styled.span`
   color: ${colors.red[500]};
   margin-left: 0.25rem;
`;

export interface FormLabelProps {
   label?: string;
   children?: ReactElement;
   isRequired?: boolean;
   whiteSpace?: 'normal' | 'nowrap';
}
export const FormLabel = ({
   label,
   isRequired = false,
   children,
   whiteSpace,
}: FormLabelProps) =>
   /** TODO: there should be a better way of handling the label here ... This feels a bit awkward */
   label ? (
      <StyledLabel>
         <span style={whiteSpace ? { whiteSpace } : undefined}>
            {label}
            {isRequired && <RequiredIndicator>*</RequiredIndicator>}
         </span>
         <>{children}</>
      </StyledLabel>
   ) : (
      <>{children}</>
   );
