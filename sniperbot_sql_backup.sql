PGDMP                      |            bot    16.2    16.2      �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16399    bot    DATABASE     ~   CREATE DATABASE bot WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE bot;
                master    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            �           0    0    SCHEMA public    ACL     Q   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;
                   postgres    false    5            �            1259    16400    incomes    TABLE     4  CREATE TABLE public.incomes (
    id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    sender_id character varying(255) NOT NULL,
    referral double precision,
    lucky double precision,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
    DROP TABLE public.incomes;
       public         heap    postgres    false    5            �            1259    16405    incomes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.incomes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.incomes_id_seq;
       public          postgres    false    5    215            �           0    0    incomes_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.incomes_id_seq OWNED BY public.incomes.id;
          public          postgres    false    216            �            1259    16406    settings    TABLE       CREATE TABLE public.settings (
    id character varying(255) NOT NULL,
    announcements boolean DEFAULT true NOT NULL,
    min_pos_value double precision DEFAULT '0.001'::double precision NOT NULL,
    auto_buy boolean DEFAULT false NOT NULL,
    auto_buy_amount double precision DEFAULT '0.1'::double precision NOT NULL,
    left_buy_amount double precision DEFAULT '1'::double precision NOT NULL,
    right_buy_amount double precision DEFAULT '5'::double precision NOT NULL,
    left_sell_amount double precision DEFAULT '25'::double precision NOT NULL,
    right_sell_amount double precision DEFAULT '100'::double precision NOT NULL,
    buy_slippage double precision DEFAULT '20'::double precision NOT NULL,
    sell_slippage double precision DEFAULT '20'::double precision NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    auto_sell boolean DEFAULT false NOT NULL,
    auto_sell_amount integer DEFAULT 50 NOT NULL,
    gas_fee double precision DEFAULT 0.0005 NOT NULL
);
    DROP TABLE public.settings;
       public         heap    postgres    false    5            �            1259    16419    tokens    TABLE     :  CREATE TABLE public.tokens (
    address character varying(255) NOT NULL,
    decimals integer,
    liquidity integer,
    mc double precision,
    name character varying(255),
    symbol character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
    DROP TABLE public.tokens;
       public         heap    postgres    false    5            �            1259    16424    trades    TABLE     }  CREATE TABLE public.trades (
    id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    input_mint character varying(255) NOT NULL,
    in_amount double precision NOT NULL,
    output_mint character varying(255) NOT NULL,
    out_amount double precision NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
    DROP TABLE public.trades;
       public         heap    postgres    false    5            �            1259    16429    trades_id_seq    SEQUENCE     �   CREATE SEQUENCE public.trades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.trades_id_seq;
       public          postgres    false    219    5            �           0    0    trades_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.trades_id_seq OWNED BY public.trades.id;
          public          postgres    false    220            �            1259    16430    users    TABLE     �   CREATE TABLE public.users (
    id character varying(255) NOT NULL,
    referrer_id character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false    5            �            1259    16435    wallets    TABLE       CREATE TABLE public.wallets (
    id character varying(255) NOT NULL,
    public_key character varying(255) NOT NULL,
    secret_key character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);
    DROP TABLE public.wallets;
       public         heap    postgres    false    5            /           2604    16440 
   incomes id    DEFAULT     h   ALTER TABLE ONLY public.incomes ALTER COLUMN id SET DEFAULT nextval('public.incomes_id_seq'::regclass);
 9   ALTER TABLE public.incomes ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215            =           2604    16441 	   trades id    DEFAULT     f   ALTER TABLE ONLY public.trades ALTER COLUMN id SET DEFAULT nextval('public.trades_id_seq'::regclass);
 8   ALTER TABLE public.trades ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219            �          0    16400    incomes 
   TABLE DATA           b   COPY public.incomes (id, user_id, sender_id, referral, lucky, created_at, updated_at) FROM stdin;
    public          postgres    false    215   �'       �          0    16406    settings 
   TABLE DATA             COPY public.settings (id, announcements, min_pos_value, auto_buy, auto_buy_amount, left_buy_amount, right_buy_amount, left_sell_amount, right_sell_amount, buy_slippage, sell_slippage, created_at, updated_at, auto_sell, auto_sell_amount, gas_fee) FROM stdin;
    public          postgres    false    217   O*       �          0    16419    tokens 
   TABLE DATA           h   COPY public.tokens (address, decimals, liquidity, mc, name, symbol, created_at, updated_at) FROM stdin;
    public          postgres    false    218   k,       �          0    16424    trades 
   TABLE DATA           u   COPY public.trades (id, user_id, input_mint, in_amount, output_mint, out_amount, created_at, updated_at) FROM stdin;
    public          postgres    false    219   �,       �          0    16430    users 
   TABLE DATA           H   COPY public.users (id, referrer_id, created_at, updated_at) FROM stdin;
    public          postgres    false    221   8       �          0    16435    wallets 
   TABLE DATA           U   COPY public.wallets (id, public_key, secret_key, created_at, updated_at) FROM stdin;
    public          postgres    false    222   �9       �           0    0    incomes_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.incomes_id_seq', 32, true);
          public          postgres    false    216            �           0    0    trades_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.trades_id_seq', 82, true);
          public          postgres    false    220            ?           2606    16443    incomes incomes_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.incomes
    ADD CONSTRAINT incomes_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.incomes DROP CONSTRAINT incomes_pkey;
       public            postgres    false    215            A           2606    16445    settings settings_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.settings DROP CONSTRAINT settings_pkey;
       public            postgres    false    217            C           2606    16447    tokens tokens_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (address);
 <   ALTER TABLE ONLY public.tokens DROP CONSTRAINT tokens_pkey;
       public            postgres    false    218            E           2606    16449    trades trades_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.trades
    ADD CONSTRAINT trades_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.trades DROP CONSTRAINT trades_pkey;
       public            postgres    false    219            G           2606    16451    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    221            I           2606    16453    wallets wallets_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.wallets DROP CONSTRAINT wallets_pkey;
       public            postgres    false    222            �   k  x���Kn�0D��Sx���:DN���#�I0�O��j
�@5�E��NȵE�����[_�1D<Y?�>�?�O�S[���I>�L��V�VO���� �Ku��>�mxRO�UWf/�n�\c�zm�7N�[iJ3v��S��k�z�K�ž%���RD��|2�e�F	����\�1qy���,��&[�[�:d+�$�|�kqJ�j!i+���=�aV9�
��^�T�؎+�*�B>O��hi4�l��hX��(��劓�o���?�I���p�+@��u�
���̾�"E}�(剓��UN`ny8xv��5��w���80wtv[��m������Σ�L�2N/w��K@���Ei�m�o	���	���|�Vp/��Sʸ��|sn���(��q/�ؒ]@�F�%�XĖ�0=��,Tb3�N�����K6�[�A�Iq/�P����V�Z�x3�^�!l38l>w�E�ًK��4�����
7o݌����i��q�.�ɲ�Q��o����{{~K���)��#On��q�m����"�����-?J x����뎰�!�7�XA����g%;�v{mQ~��L%���e%R�z�?��n	)n�ce�� ��      �     x���K�"1D��)ط��ȟ�>ˬ��_��S.�0�EH~22�01�[n",?���-l�~|Y�	���]���N����~.����j�Y��%PX[i`W֨�Y���ީv�B�u�$����'��H��ڌ��U�t�;[y�W�����V
-q�a��B���K�Dm%�F�,mYP���?�<�^���Y;i�%���&��zO��?��%/�Gq7t�bv���}����V��]���U8�p��ǷG2�<��+y�-���ks��L9dj���>�/��]a��.�a2 mY��R�$�ckְ�*�0�I9*"�2����	9�v$P7[ۉ��iQ8���'�3�$�-m\J�U�F����m�/�IW�-*.�م���v9i5`xۘ�3�����,�|�N�����sA嫥������җ�2���ӵc���g�in����R>��E�*�yu�зYm=�U�=4fc�V�\a����"#̋���v����h�?�r��yL��      �      x������ � �      �   i  x�͚YS"����_�ݟ�:*�ڸ�mQ�s#�(�,���d;3�s�t�g�ހz:;+��ꆊ���up����VP�Tڷ���m�7牱��oO�80�g���|��py;��/����`�AGV��o���P�����/���a�x\�S}F������v�~8}���;���mxye�n��ޝ0!琨jB��B����]
7��A{�0�����<nRR��-}c���·��rU��� ���%e~p@y*�Qа�CR6	\���B��k@�}	�������+���g��f�]�[������7�~��==�������{�}��G�
�,�=�<�ț����� ��F,������Asoppu0��Z�uvvW�y������p6\v�I}6��V ����l�YA���jZJQa�"Q0�(9�L��,1SL�d��II���N!+r�^{�ޙO4�K�*�*r�]z��$��G���S{���;�7����x�����V�1>��������*��LRig�(�c�ysBR���2[�|��P���e��-�	I������J�Em�S
L�U�"�,rJQ�������hs�\EY�[�����"�t�,��ȘmaNHJ
������n'������t����lsq՛��:|k_��S{x���w�R4�&�~��9-)p_Ϭ5X��`�8q�ۙ?$�FX~��f����������FRR~��1y.v�E��CR(]���Qϡ�>�Ȍfgy������V���9���W���U�����A{�z}h��jz_a��1ٵߡ�ģ����&%���ߧ�{��x�m�ޯ�������yu|����F������Ȅ8⡩f'5Yn���A#��ߒII	j"�E�%C�bIA���p��	qƸ7!)�/ƵAf�Cl|L�SP�_��%��-j,^G[�7))4_��u@پa�hK�&%�v���o��.��u����tC/�Eor�Z����y�/k���bO�,UP�4VŠ	{�ENK
�W#[g���dB���ത0��v�Nż�%$��V�6���$����D�V;��ZЌ���9δ�H��?�i� �;���[�g�GXN�i���0j ���ê�W!�V/â4v�,�F6E��e#')���o�W[���[k2�>�C��i
�~o�[�{��y���N�O��[p��,8���)6��$�d�Ӓ��Qg��P�\0\l�f`��}rٿtx;HLO���$Eg'9��V�8��/�����㚃�2��[C�C����6�G{�I������X�p`�V�'�_�V�V�F���yI�~D[�8�6���$���ƂX	��N��m�"i��<�S��5����E/�ȝ,.;���ɛ�_^���m�x�����Q��zc@F����X��<�4qNR$����F;p��J���l�z��z���񨷼�w7�{|�<��/:f�2��N���W$���2�Y���#'%E�l��!-�doC0),�1�H�<K����%�^���.��h��A8�(
I�BK�/n�=�pP
s*>���a�v���������X�szk9�E�f#�F8�(�w-Ů���Y��16Fj���'NJ��|�����T%�[��e�v��ق���WG�{�O�J���f�,�29-)���X�P��ߨ9��Zf��e$%�%ZH�n���o	
&��N�\��:6����$�<�����z�ao֣Ūo��O�����}ݞ6�����ܭ�O��j�\�I�P�5h����{�w[���Z�`.��+R�I����Z�i�`(�"l�sBR�w��pYo�Ѱuh&׮�0����(����q�wrW���n9�ƭ�Z�q��r�w.G[���s�h��b|s��z�`qtAܛ6W�i{�����E�����هYň����ELq�����q��iI�T�+�z��&����Q� #崤L����}8v2-k�����}6��Ғ2��Wpu-�3NZ`��Ei��Y.;	��(�%eJ���(�]m���sh�N\m�o�o�_k˷��hb�������1FY`~�=灓�2��Wtm)p�
ηA�	k��2.�qp+�)]���c��b8�LΛ���Q���ק�f��u5�&O����9|���E[�+�aٯR��X��'3��%eR����@��o`<��X8l�b�����q�i��v��;\f#7W�,����t�fpFR&��
U	$)����.�Ye��,�����m�	I�P���X(Fl�w�*2�F�3IY����EY����lB|�2��]R�0�-��T���Jc쯁��-��jN��Z�?�%d/1K%6�"��R8!)k�,`�~��-����^g�eFR�|���ŏ��Б����L��N%b٪��~�jƏg\Մ�0hJ���l(m�ey`��a�b�+�$��\ s��OP��I9��af�d�;G��^�O0ƪ���6Ϝ����a��=iC�O��ǔl�X<rb!B�挤��f���ޮ�&�=_//ϛ/#�=?�i�x��6����f�^�Do�b]bR?�l��4~�d"�F���K�w��7��YM�n�lF��8���H�F�8))ǿ!��g4����Z^���e�S�r�t�cdGQ�UfF�����X�ɚ���y⤤�-�ǉ5�R��\g��4�%B��II9W>���W��h_����њ0���G��P�8-)�˧��^��?��,��PFo.i�(�� '%���Oz�b4	�/܃�������q�}�M�7��M{P[`��4G݊tk��0�+}��M(�����V
4��	2g��jtd}�T�%�tR��/�R�����2U�l#�T�OMz��n��S_RG/s���;�yؤ��)����      �   �  x�}��q�0E�F�g����"R���#�'���{��P� �KS�Ə�����H�D�T�#��{N&ƒi/ʃ��wBΊ����5^8�²+v�L�I2�yw�<9Xsu�E>1�ȨŰpI�Hw;�'�dC�O��[xא���r��*>O�u����i��Xx�t?�tH�>FO��x"p��H�␫w���#�2v�.d*������#\vŊ��[�U��q
����^Ɔ��H�˥l�d�`��A��H^�'�R�T�����dq:�3�C)O��cvd�o迃{��}y>��W�;l�d�8��L��y ��8�xZ��Q������'C;��C���lU���B�PgO�v�iQ��<�0u1Խ��~)UyQ� �C98      �   f
  x�}WɎ��\�_Q��N��.�cFLb���6̓�f��Q�Vwef��²��9q !$���F��$Ҙ��s�@\ęz
��[c.o�t�3Ki�&5�����<�f~iQ��֠4Bv���u��/���1'}*0�i癯ms�ĸ�[Ȃ�N�8�U\��0A��~��7� ? ����!�n�z� I�8���|!7R��*�e�'�̮����~�}�P�n��3�`Đ�"c8�Z��qˀq�4��h	�;�QR#e�4˓1��n��t(c��O4y�-Ek���$j�o����w��8�[Con8bha�:�;P:�ʸ5=�Z�b+��+�ia=1<�:rC�"�em:`�Q�m�*�V���)�Ϊ���g'���� 6���גԌ��b�Ih���P�+86�К��r�? ��~7��7
�n8�CDc�̡�-����r�
9�=�^s+��{���6� F�{g���gF�����Dp��!� �̓��u/�l;]T��w�I�P��H(�T��`|�)	R�y/5g������@}����h�o�E �F#�"19(k���H{��]�_�"��2M&�wygܽ���%F��K�9�l���<{�WAD���/Z-s$U����L�A*��5���h��W����3����`5�_���w
�e�
�Q$M]�@4�X��3*d�`I�Q�z��2���
�H�^�4NU��IR9{yБ�%%�xE5u�|9�T[0B]�L�3}c�7����l�hd1�@�8�2��i��%�e��+�>p���;�B�4h� ����W��I�]����ұf�D`�1�����YL��?0����I N:���"��[��yX����u�$�Z�R�o;&R�#�Ns�
L��⹵�Gh��X��}�J�n8x�*�3�F� ��C���r������ȟ��vb�l�ZF̴7�P�0h����ʉ�8>'Uj�D4��� �ja6L�h�'N��vz^g���J��K�?F���r�����8X�����d��f~#�W荂�rC�(�e�Բ������Ī����6�rZz�GIH�Օ�n27�IYY�3��#)��Si�J��0�K}��Wd��m{��[�!~�r��U��Hy�ɩk�/� ~\�0?���I�7�@� $$ �1g��Ǫ�O��F'sP��%�C3�aOn�o��y[M�<�i���0���֩ae���)7���@���w��ma����{��jA����X�}�D-���.������@\x�i櫌�������a0i�۴^�E�#B��CN��v+�5�4F�S�tlh6ętZW(]z�ӻ�'���?5v~&���}ӌR�,��*|����V�l�S�l蠱قz�A(�x�J�}�r�;E}���1 ^�c<;�lo�Wi0N"�Pߓ��:�I��㕉g[��e�҈0����ɶ5���Eg�u���P��H���: ���fJ�XSA�ݛ7�����$����>�q��R��+N� �D��|Ω��	o����(����l�r�&C白��X�#��Ӳ��� �`�do=�*�`5N�,�4��V+TkN�ou�H��9-%ޟ��-��ڎ�R���jN��c���J���5�$��Sߡ랺� N��Г�*�d�U�6�/��m�Z�0�g������/�´-�jA�h4���,����z���l�v�,g�=-�zu�͊��I�W�d�0^�����p���9�¼j��Wp�~�;$��2~�ި�.C�:o11x��
�x�3j��G(��;�jB<�|m��K:F��O�>{-��eR��41����uڑؗ���݋�\�r�K7'~�r�ڨd�\'a�N�X�V:�_\���W�ޘ_N��AoC_s���6��ܠI&��W�T}zw�푯|pLd)��#|��D�t).�;���^��8�{�f)3�3�Ul�nt�6_%�1�)��I�y����/S�E<��������#> q�;��/2��f�;"�2�K� 	0�)eA�5f��y�X���OØ��>��1f�;����a.��Z�J���*%��E��Dm�g��fhPG�7�1���2�|��I����f��P��Xw#������u9�� }��z#	
��z�`0�㫸K:_�R���ұ�����Bg�j�]��^��'�x	>N7��rU�j��Ь�����6ݼ�iIO{4�:ų��@�K�G�����F�",@��c���+A���?�7p�f��V��jbN��i{՛[o�9�椸�x��o5)�����yyQ���X�k㕉|p��:T�!�Rȧ8��X����<�<MAu@����w�1ى����K���������['�z�P�~�l�H�tʶ�1�3���&�8.�Ȫ���:b�JG�s�*h����T�>��c���m1K<�H�M�iz��#��<{�~t@�xM�6�י�Ӳ�!�̱�L��ԏ���^�@|��7�*q��)� � ���`N��hiF���a��ݬ*x��fh��t���&yU��j�8+f����ZD�}{"=����'Jv��S�*�"եуu�a���<uũ��W��M�-�0v���*@WY_MM|R�z������� ����     