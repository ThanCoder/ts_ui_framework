export interface CssStyle {
    display?: 'block' | 'inline' | 'flex' | 'none';
    flexDirection?: 'row' | 'column';
    justifyContent?: 'flex-start' | 'center' | 'space-between';
    alignItems?: 'flex-start' | 'center' | 'stretch';
    width?: string | number;
    height?: string | number;
}
